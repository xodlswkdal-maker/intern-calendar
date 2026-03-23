import { useState, useEffect, useRef, useCallback } from 'react'

// ── Scene constants ───────────────────────────────────────────────────────────
const S = 2            // pixel scale
const VW = 250         // viewBox width
const FL_INT = 48      // floor interior height
const FL_SEP = 6       // floor slab thickness
const FL_UNIT = FL_INT + FL_SEP  // 54 per floor
const FLOORS = 6
const VH = FLOORS * FL_UNIT + 28  // 6×54 + 28 = 352
const STAIR_W = 24     // staircase column width (each side)
const COR_L = STAIR_W               // corridor left x
const COR_R = VW - STAIR_W          // corridor right x  (250-24=226)

// Y of floor surface (feet level), floor 1=bottom, floor 6=top
function floorFeet(n) {
  return (FLOORS - n) * FL_UNIT + FL_SEP + FL_INT  // (6-n)*54 + 6 + 48 = (6-n)*54+54
}
// n=1 → 5*54+54=324, n=6 → 0*54+54=54

// ── Palette ───────────────────────────────────────────────────────────────────
const _ = null
// Taein
const TH  = '#1a0e08'  // dark hair
const TH2 = '#2e1810'  // hair highlight
const TSK = '#f3c28a'  // skin
const TSL = '#fad5a5'  // skin light
const TSH = '#d99060'  // skin shadow
const TEY = '#12090a'  // eye
const TEP = '#2563eb'  // eye pupil (blue)
const TGL = '#1a1008'  // glasses frame
const TGR = '#c5ddf0'  // glasses lens
const TMO = '#c04040'  // mouth
const TWC = '#eef3ff'  // white coat
const TWS = '#ccd8f0'  // coat shadow
const TTB = '#1d4ed8'  // taein blue badge
const TTP = '#263244'  // trousers
const TTS = '#1a2233'  // trousers shadow
const TSH2= '#1a1a30'  // shoes
const TSH3= '#2a2a45'  // shoe toe
const TNK = '#e8a87a'  // neck
const TBT = '#ffffff'  // shirt/undershirt white

// Sojin
const SHR = '#7a3828'  // hair brown-red
const SH2C = '#5a2818'  // hair dark
const SH3C = '#a05040'  // hair highlight
const SSK = '#f5c8a0'  // skin
const SSL = '#ffddc0'  // skin light
const SSH = '#d8a070'  // skin shadow
const SEY = '#120c10'  // eye
const SEP = '#0e7490'  // eye pupil (teal)
const SEYL = '#ffffff'  // eye shine
const SMO = '#e06080'  // mouth/lip
const SNC = '#e8b085'  // neck
const SWC = '#f0f6ff'  // white coat
const SWS = '#c8d8f0'  // coat shadow
const STB = '#0891b2'  // teal badge
const SPN = '#2e1040'  // navy pants
const SPS = '#1e0830'  // pants shadow
const SSO = '#1a1a30'  // shoes
const SSO2= '#2c2c44'  // shoe highlight
const SHA = '#d4a0c0'  // hair accessory (pin)

// Shared wall/building colors
const WL  = '#d8e8f4'  // wall light blue
const WLD = '#c4d4e8'  // wall darker
const WLS = '#b0c4da'  // wall strip
const FLC = '#e4e8ec'  // floor tile A
const FLD = '#d8dce0'  // floor tile B
const SLB = '#7a90a4'  // slab/ceiling
const SLT = '#8a9fb4'  // slab top highlight
const DOF = '#a4b8cc'  // door face
const DOD = '#8ca0b8'  // door dark
const STR = '#8090a0'  // stair step
const STS = '#6070808' // stair shadow (will be #607080)
const WND = '#b8d4f0'  // window glass
const WNF = '#8ab0d0'  // window frame

// ── Sprite: TAEIN (11 wide × 22 tall at scale S) ─────────────────────────────
// Walking frame A (left foot forward) and B (right foot forward)
const T_BASE = [
  /*0*/ [_,  _,  TH,  TH,  TH,  TH,  TH,  _,   _,   _,   _ ],
  /*1*/ [_,  TH, TH2, TH2, TH2, TH2, TH2, TH,  _,   _,   _ ],
  /*2*/ [_,  TH, TSL, TSK, TSK, TSK, TSL, TH,  _,   _,   _ ],
  /*3*/ [_,  _,  TGL, TGR, TGL, TGL, TGR, TGL, _,   _,   _ ],  // glasses
  /*4*/ [_,  _,  TSK, TSL, TSK, TSK, TSL, TSK, _,   _,   _ ],
  /*5*/ [_,  _,  TSK, TSK, TMO, TMO, TSK, TSK, _,   _,   _ ],  // mouth
  /*6*/ [_,  _,  TSH, TNK, TNK, TNK, TNK, TSH, _,   _,   _ ],  // neck
  /*7*/ [_,  TWC, TWC, TNK, TNK, TNK, TNK, TWC, TWC, _,   _ ],  // collar
  /*8*/ [TWC, TWC, TWC, TWC, TWC, TWC, TWC, TWC, TWC, TWC, _ ],  // shoulder
  /*9*/ [TWC, TWS, TWC, TBT, TTB, TBT, TWC, TWC, TWS, TWC, _ ],  // coat body + badge
  /*10*/[TWC, TWS, TWC, TWC, TWC, TWC, TWC, TWC, TWS, TWC, _ ],
  /*11*/[TWC, TWS, TWC, TWC, TWC, TWC, TWC, TWC, TWS, TWC, _ ],
  /*12*/[_,  TWC, TWC, TWS, TWC, TWC, TWS, TWC, TWC, _,   _ ],  // coat lower
  /*13*/[_,  _,  TTP, TTP, TTP, TTP, TTP, TTP, _,   _,   _ ],  // waist
]

const T_LEGS_A = [  // left forward
  /*14*/[_,  _,  TTP, TTS, _,   _,   TTP, TTS, _,   _,   _ ],
  /*15*/[_,  _,  TTP, TTS, _,   _,   TTP, TTS, _,   _,   _ ],
  /*16*/[_,  _,  TTP, TTS, _,   _,   TTP, _,   _,   _,   _ ],
  /*17*/[_,  _,  TSH2,TSH3,_,   _,   TSH2,TSH3,_,   _,   _ ],  // shoes
  /*18*/[_,  TSH3,TSH2,TSH3,_,  _,   _,   TSH2,TSH3,_,   _ ],
]
const T_LEGS_B = [  // right forward
  /*14*/[_,  _,  TTP, _,   _,   TTS, TTP, TTS, _,   _,   _ ],
  /*15*/[_,  _,  TTP, _,   _,   TTS, TTP, TTS, _,   _,   _ ],
  /*16*/[_,  _,  _,   TTP, _,   TTS, TTP, TTS, _,   _,   _ ],
  /*17*/[_,  _,  _,   TSH2,TSH3,_,   TSH2,TSH3,_,   _,   _ ],
  /*18*/[_,  _,  _,   _,   TSH2,TSH3,TSH2,TSH3,_,   _,   _ ],
]

const TAEIN_A = [...T_BASE, ...T_LEGS_A]
const TAEIN_B = [...T_BASE, ...T_LEGS_B]

// ── Sprite: SOJIN (11 wide × 22 tall) ────────────────────────────────────────
const S_BASE = [
  /*0*/ [_,  _,  SHR, SHR, SHR, SHR, SHR, _,   _,   _,   _ ],
  /*1*/ [_,  SH2C,SHR, SH3C,SH3C,SH3C,SHR, SH2C,_,   _,   _ ],
  /*2*/ [_,  SHR, SSL, SSK, SSK, SSK, SSL, SHR, SHA, _,   _ ],  // face + hairpin
  /*3*/ [_,  _,   SEY, SEP, SEYL,SEP, SEYL,SEY, _,   _,   _ ],  // eyes with shine
  /*4*/ [_,  _,   SSK, SSL, SSK, SSK, SSL, SSK, _,   _,   _ ],
  /*5*/ [_,  _,   SSK, SSK, SMO, SMO, SSK, SSK, _,   _,   _ ],  // lips
  /*6*/ [_,  _,   SSH, SNC, SNC, SNC, SNC, SSH, _,   _,   _ ],
  /*7*/ [_,  SWC, SWC, SNC, SNC, SNC, SNC, SWC, SWC, _,   _ ],
  /*8*/ [SWC, SWC, SWC, SWC, SWC, SWC, SWC, SWC, SWC, SWC, _ ],
  /*9*/ [SWC, SWS, SWC, TBT, STB, TBT, SWC, SWC, SWS, SWC, _ ],
  /*10*/[SWC, SWS, SWC, SWC, SWC, SWC, SWC, SWC, SWS, SWC, _ ],
  /*11*/[SWC, SWS, SWC, SWC, SWC, SWC, SWC, SWC, SWS, SWC, _ ],
  /*12*/[_,  SWC, SWC, SWS, SWC, SWC, SWS, SWC, SWC, _,   _ ],
  /*13*/[_,  _,  SPN, SPN, SPN, SPN, SPN, SPN, _,   _,   _ ],
]

const S_LEGS_A = [
  /*14*/[_,  _,  SPN, SPS, _,   _,   SPN, SPS, _,   _,   _ ],
  /*15*/[_,  _,  SPN, SPS, _,   _,   SPN, SPS, _,   _,   _ ],
  /*16*/[_,  _,  SPN, SPS, _,   _,   SPN, _,   _,   _,   _ ],
  /*17*/[_,  _,  SSO, SSO2,_,   _,   SSO, SSO2,_,   _,   _ ],
  /*18*/[_,  SSO2,SSO,SSO2,_,   _,   _,   SSO, SSO2,_,   _ ],
]
const S_LEGS_B = [
  /*14*/[_,  _,  SPN, _,   _,   SPS, SPN, SPS, _,   _,   _ ],
  /*15*/[_,  _,  SPN, _,   _,   SPS, SPN, SPS, _,   _,   _ ],
  /*16*/[_,  _,  _,   SPN, _,   SPS, SPN, SPS, _,   _,   _ ],
  /*17*/[_,  _,  _,   SSO, SSO2,_,   SSO, SSO2,_,   _,   _ ],
  /*18*/[_,  _,  _,   _,   SSO, SSO2,SSO, SSO2,_,   _,   _ ],
]

const SOJIN_A = [...S_BASE, ...S_LEGS_A]
const SOJIN_B = [...S_BASE, ...S_LEGS_B]

const SPRITE_W = 11  // columns
const SPRITE_H = 19  // rows (0..18)

// Mirror sprite horizontally
const mir = sp => sp.map(row => [...row].reverse())
const TAEIN_A_L  = mir(TAEIN_A)
const TAEIN_B_L  = mir(TAEIN_B)
const SOJIN_A_L  = mir(SOJIN_A)
const SOJIN_B_L  = mir(SOJIN_B)

// ── Sprite renderer ───────────────────────────────────────────────────────────
function Sprite({ data, x, y }) {
  const rects = []
  for (let ri = 0; ri < data.length; ri++) {
    for (let ci = 0; ci < data[ri].length; ci++) {
      const c = data[ri][ci]
      if (c) rects.push(
        <rect key={`${ri}-${ci}`}
          x={x + ci * S} y={y + ri * S}
          width={S} height={S}
          fill={c} shapeRendering="crispEdges" />
      )
    }
  }
  return <>{rects}</>
}

// ── Building background ───────────────────────────────────────────────────────
function Building() {
  const floors = []
  for (let n = 1; n <= FLOORS; n++) {
    const fy = floorFeet(n)        // y of floor surface
    const ceilY = fy - FL_INT      // y of ceiling (interior top)
    const slabTop = ceilY - FL_SEP // y of slab top (same as prev floor surface)

    // Floor slab
    floors.push(
      <rect key={`slab-${n}`} x={0} y={slabTop < 0 ? 0 : slabTop} width={VW} height={FL_SEP}
        fill={SLB} shapeRendering="crispEdges" />,
      <rect key={`slabhi-${n}`} x={0} y={slabTop < 0 ? 0 : slabTop} width={VW} height={1}
        fill={SLT} shapeRendering="crispEdges" />
    )

    // Wall interior
    floors.push(
      <rect key={`wall-${n}`} x={STAIR_W} y={ceilY} width={VW - 2 * STAIR_W} height={FL_INT}
        fill={WL} shapeRendering="crispEdges" />,
      // Wainscoting strip
      <rect key={`wains-${n}`} x={STAIR_W} y={fy - 10} width={VW - 2 * STAIR_W} height={7}
        fill={WLD} shapeRendering="crispEdges" />,
      <rect key={`base-${n}`} x={STAIR_W} y={fy - 3} width={VW - 2 * STAIR_W} height={3}
        fill={WLS} shapeRendering="crispEdges" />
    )

    // Floor tiles
    for (let tx = STAIR_W; tx < VW - STAIR_W; tx += 14) {
      floors.push(
        <rect key={`tile-${n}-${tx}`} x={tx} y={fy} width={7} height={4}
          fill={FLD} shapeRendering="crispEdges" />,
        <rect key={`tileb-${n}-${tx}`} x={tx} y={fy + 4} width={7} height={2}
          fill={FLC} shapeRendering="crispEdges" />
      )
    }
    floors.push(
      <rect key={`floor-${n}`} x={STAIR_W} y={fy} width={VW - 2 * STAIR_W} height={1}
        fill="rgba(255,255,255,0.5)" shapeRendering="crispEdges" />
    )

    // Floor number label
    floors.push(
      <text key={`lbl-${n}`} x={STAIR_W + 6} y={ceilY + 11} fill="#8090a0"
        fontSize="5" fontFamily="monospace" fontWeight="bold">
        {n}F
      </text>
    )

    // Wall decorations (vary by floor)
    const deco = []
    if (n === 1 || n === 3 || n === 5) {
      // ECG monitor
      deco.push(
        <rect key="mon" x={COR_L + 40} y={ceilY + 6} width={28} height={18} rx="1" fill="#162040" shapeRendering="crispEdges" />,
        <polyline key="ecg" points={`${COR_L+43},${ceilY+14} ${COR_L+46},${ceilY+14} ${COR_L+48},${ceilY+10} ${COR_L+50},${ceilY+18} ${COR_L+52},${ceilY+14} ${COR_L+55},${ceilY+14} ${COR_L+57},${ceilY+12} ${COR_L+59},${ceilY+14} ${COR_L+62},${ceilY+14} ${COR_L+65},${ceilY+14}`}
          fill="none" stroke="#34d399" strokeWidth="1" shapeRendering="crispEdges" />
      )
      // door
      deco.push(
        <rect key="door" x={COR_R - 30} y={ceilY + 4} width={20} height={FL_INT - 4} rx="0.5" fill={DOF} shapeRendering="crispEdges" />,
        <rect key="doorin" x={COR_R - 29} y={ceilY + 5} width={18} height={FL_INT - 6} fill={DOD} shapeRendering="crispEdges" />,
        <circle key="knob" cx={COR_R - 11} cy={ceilY + FL_INT / 2} r="1.5" fill="#607080" />
      )
    } else {
      // window + chart
      deco.push(
        <rect key="win" x={COR_L + 35} y={ceilY + 7} width={22} height={14} rx="0.5" fill={WND} shapeRendering="crispEdges" />,
        <rect key="winf" x={COR_L + 35} y={ceilY + 7} width={22} height={14} rx="0.5" fill="none" stroke={WNF} strokeWidth="1" shapeRendering="crispEdges" />,
        <line key="winv" x1={COR_L + 46} y1={ceilY + 7} x2={COR_L + 46} y2={ceilY + 21} stroke={WNF} strokeWidth="0.8" />,
        <line key="winh" x1={COR_L + 35} y1={ceilY + 14} x2={COR_L + 57} y2={ceilY + 14} stroke={WNF} strokeWidth="0.8" />
      )
      // Medical cross
      deco.push(
        <rect key="crv" x={COR_R - 26} y={ceilY + 7} width={4} height={12} rx="0.5" fill="#e74c3c" opacity="0.85" />,
        <rect key="crh" x={COR_R - 29} y={ceilY + 11} width={10} height={4} rx="0.5" fill="#e74c3c" opacity="0.85" />
      )
      // Chart
      deco.push(
        <rect key="chart" x={COR_L + 80} y={ceilY + 7} width={10} height={13} rx="0.5" fill="#fffde7" stroke="#d4b860" strokeWidth="0.5" />,
        ...[9, 12, 15, 18].map((yy, i) => <line key={`cl${i}`} x1={COR_L + 82} y1={ceilY + yy} x2={COR_L + 88} y2={ceilY + yy} stroke="#bbb" strokeWidth="0.6" />)
      )
    }
    floors.push(...deco.map((el, i) => ({ ...el, key: `deco-${n}-${i}` })))
  }

  // Ground
  floors.push(
    <rect key="ground" x={0} y={floorFeet(1) + 6} width={VW} height={VH - floorFeet(1) - 6}
      fill="#a0b0c0" shapeRendering="crispEdges" />,
    <rect key="groundhi" x={0} y={floorFeet(1) + 6} width={VW} height={2}
      fill="#b0c4d8" shapeRendering="crispEdges" />
  )

  return <>{floors}</>
}

// ── Staircase rendering ───────────────────────────────────────────────────────
function Stairs({ side }) {  // side: 'left' | 'right'
  const x0 = side === 'left' ? 0 : VW - STAIR_W
  const x1 = side === 'left' ? STAIR_W : VW
  const cx = (x0 + x1) / 2
  const elements = []

  // Background column
  elements.push(
    <rect key="bg" x={x0} y={0} width={STAIR_W} height={VH} fill="#b0c4d8" shapeRendering="crispEdges" />,
    <rect key="bghi" x={side === 'left' ? x1 - 1 : x0} y={0} width={1} height={VH} fill="#8090a0" shapeRendering="crispEdges" />
  )

  // Draw stair steps between each floor
  for (let n = 1; n < FLOORS; n++) {
    const yBottom = floorFeet(n) - 3
    const yTop = floorFeet(n + 1) - 3
    const stepH = (yBottom - yTop) / 5
    for (let s = 0; s < 5; s++) {
      const sy = yBottom - s * stepH
      // Stair step shape
      const stepX = side === 'left'
        ? x0 + (s * (STAIR_W - 4)) / 4
        : x1 - 4 - (s * (STAIR_W - 4)) / 4
      elements.push(
        <rect key={`step-${n}-${s}`}
          x={side === 'left' ? x0 : stepX}
          y={sy - stepH + 2}
          width={STAIR_W - 2}
          height={2}
          fill={STR} shapeRendering="crispEdges" />
      )
    }
    // Handrail
    elements.push(
      <line key={`rail-${n}`}
        x1={cx} y1={yBottom - 8}
        x2={cx} y2={yTop - 8}
        stroke="#6a7a8a" strokeWidth="1.5" shapeRendering="crispEdges" />
    )
  }

  // Floor labels
  for (let n = 1; n <= FLOORS; n++) {
    const fy = floorFeet(n)
    elements.push(
      <rect key={`mark-${n}`} x={x0 + 1} y={fy - FL_INT / 2 - 2} width={STAIR_W - 2} height={1} fill="#8090a0" opacity="0.5" />
    )
  }

  return <>{elements}</>
}

// ── Waypoint path (character moves through 6 floors up then down) ─────────────
const CHAR_H = SPRITE_H * S  // 19*2 = 38px

function buildPath() {
  // Each segment: { x0, y0, x1, y1, facing, speed }
  // speed: 'walk'=70px/s, 'climb'=40px/s
  const WS = 70, CS = 40
  const segs = []
  const charFeet = n => floorFeet(n)
  const charY = n => charFeet(n) - CHAR_H

  // Go UP: floor 1→6 (zigzag)
  for (let n = 1; n <= FLOORS - 1; n++) {
    const goRight = n % 2 === 1
    const startX = goRight ? COR_L : COR_R - SPRITE_W * S
    const endX   = goRight ? COR_R - SPRITE_W * S : COR_L
    // Walk across floor
    segs.push({ x0: startX, y0: charY(n), x1: endX, y1: charY(n), facing: goRight ? 'r' : 'l', speed: WS })
    // Climb stairs
    const stairX = goRight ? COR_R - SPRITE_W * S : COR_L
    segs.push({ x0: stairX, y0: charY(n), x1: stairX, y1: charY(n + 1), facing: goRight ? 'r' : 'l', speed: CS })
  }
  // Top floor
  segs.push({ x0: COR_L, y0: charY(6), x1: COR_R - SPRITE_W * S, y1: charY(6), facing: 'r', speed: WS })

  // Go DOWN: floor 6→1
  for (let n = FLOORS; n >= 2; n--) {
    const goLeft = n % 2 === 0
    const startX = goLeft ? COR_R - SPRITE_W * S : COR_L
    const endX   = goLeft ? COR_L : COR_R - SPRITE_W * S
    segs.push({ x0: startX, y0: charY(n), x1: endX, y1: charY(n), facing: goLeft ? 'l' : 'r', speed: WS })
    const stairX = goLeft ? COR_L : COR_R - SPRITE_W * S
    segs.push({ x0: stairX, y0: charY(n), x1: stairX, y1: charY(n - 1), facing: goLeft ? 'l' : 'r', speed: CS })
  }

  // Compute duration for each segment
  return segs.map(seg => {
    const dist = Math.hypot(seg.x1 - seg.x0, seg.y1 - seg.y0)
    return { ...seg, dur: dist / seg.speed }
  })
}

const PATH = buildPath()
const TOTAL_DUR = PATH.reduce((s, seg) => s + seg.dur, 0)

function getCharState(t) {
  const tWrapped = ((t % TOTAL_DUR) + TOTAL_DUR) % TOTAL_DUR
  let elapsed = 0
  for (const seg of PATH) {
    if (tWrapped <= elapsed + seg.dur) {
      const frac = seg.dur > 0 ? (tWrapped - elapsed) / seg.dur : 0
      return {
        x: seg.x0 + (seg.x1 - seg.x0) * frac,
        y: seg.y0 + (seg.y1 - seg.y0) * frac,
        facing: seg.facing,
        onStairs: Math.abs(seg.x1 - seg.x0) < 4,
      }
    }
    elapsed += seg.dur
  }
  return { x: PATH[0].x0, y: PATH[0].y0, facing: 'r', onStairs: false }
}

// ── XP spots (near wall features) ────────────────────────────────────────────
const XP_SPOTS = [
  { x: COR_L + 54, floor: 1 }, { x: COR_L + 54, floor: 2 },
  { x: COR_R - 22, floor: 3 }, { x: COR_L + 90, floor: 4 },
  { x: COR_R - 22, floor: 5 }, { x: COR_L + 54, floor: 6 },
]

// ── Main component ────────────────────────────────────────────────────────────
let _xpId = 0

export default function InternPixelArt() {
  const [tState, setTState] = useState({ x: COR_L, y: floorFeet(1) - CHAR_H, facing: 'r', onStairs: false })
  const [sState, setSState] = useState({ x: COR_R - SPRITE_W * S, y: floorFeet(1) - CHAR_H, facing: 'l', onStairs: false })
  const [frame, setFrame] = useState(0)
  const [particles, setParticles] = useState([])
  const t0 = useRef(performance.now())
  const rafId = useRef(null)

  // Animation loop
  useEffect(() => {
    const loop = (now) => {
      const t = (now - t0.current) / 1000
      setTState(getCharState(t))
      setSState(getCharState(t + TOTAL_DUR * 0.5))  // Sojin offset by half cycle
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  // Walk frame toggle
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => 1 - f), 160)
    return () => clearInterval(iv)
  }, [])

  // XP particles
  useEffect(() => {
    const pid = { current: 0 }
    const iv = setInterval(() => {
      const id = ++pid.current
      const spot = XP_SPOTS[id % XP_SPOTS.length]
      const yPop = floorFeet(spot.floor) - CHAR_H - 6
      const isTaein = id % 2 === 0
      setParticles(prev => [
        ...prev.slice(-8),
        { id, x: spot.x + (Math.random() * 12 - 6), y: yPop, isTaein }
      ])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1000)
    }, 1300)
    return () => clearInterval(iv)
  }, [])

  // Resolve sprites based on state
  function getSprite(state, char, fr) {
    const { facing, onStairs } = state
    if (char === 'taein') {
      return facing === 'r'
        ? (fr === 0 ? TAEIN_A : TAEIN_B)
        : (fr === 0 ? TAEIN_A_L : TAEIN_B_L)
    }
    return facing === 'r'
      ? (fr === 0 ? SOJIN_A : SOJIN_B)
      : (fr === 0 ? SOJIN_A_L : SOJIN_B_L)
  }

  return (
    <div style={{ lineHeight: 0 }}>
      <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} style={{ display: 'block', imageRendering: 'pixelated' }}>
        <Building />
        <Stairs side="left" />
        <Stairs side="right" />

        {/* Taein */}
        <Sprite
          data={getSprite(tState, 'taein', frame)}
          x={Math.round(tState.x)}
          y={Math.round(tState.y)}
        />

        {/* Sojin */}
        <Sprite
          data={getSprite(sState, 'sojin', frame)}
          x={Math.round(sState.x)}
          y={Math.round(sState.y)}
        />

        {/* XP particles */}
        {particles.map(p => (
          <text key={p.id}
            x={p.x} y={p.y}
            textAnchor="middle"
            fill={p.isTaein ? '#2563eb' : '#0891b2'}
            fontSize="7" fontWeight="900" fontFamily="monospace"
            className="xp-particle">
            +XP
          </text>
        ))}
      </svg>
    </div>
  )
}
