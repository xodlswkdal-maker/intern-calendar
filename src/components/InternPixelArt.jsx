import { useState, useEffect } from 'react'

// ─── Scene layout ─────────────────────────────────────────────────────────────
const S = 2             // scale: pixels per sprite pixel
const VW = 250
const N_FLOORS = 6
const FL_H = 48         // interior height per floor
const FL_SEP = 6        // slab thickness
const FL_UNIT = FL_H + FL_SEP   // 54
const VH = N_FLOORS * FL_UNIT + 22  // 346

const STAIR_W = 22      // staircase column width
const COR_X0 = STAIR_W           // corridor left edge (22)
const COR_X1 = VW - STAIR_W      // corridor right edge (228)

// Y of floor surface (feet level); floor 1 = bottom, floor 6 = top
function feetY(floor) {
  return (N_FLOORS - floor) * FL_UNIT + FL_SEP + FL_H
}
// feetY(1) = 5*54 + 6 + 48 = 324
// feetY(6) = 0*54 + 6 + 48 = 54

// ─── Colours ──────────────────────────────────────────────────────────────────
const _ = null

// Taein
const TKH = '#1a0e08'  // hair dark
const TKL = '#2e1810'  // hair mid
const TSK = '#f3c28a'  // skin
const TSL = '#fad5a5'  // skin light
const TSH = '#d99060'  // skin shadow
const TEY = '#180c0a'  // eye
const TGL = '#1a1008'  // glasses frame
const TGR = '#c5ddf0'  // glasses lens
const TMO = '#c04040'  // mouth
const TNK = '#e8a87a'  // neck
const TWC = '#eef3ff'  // white coat
const TWS = '#ccd8f0'  // coat crease
const TBG = '#1d4ed8'  // blue badge
const TTP = '#263244'  // trousers
const TTS = '#1a2233'  // trousers shadow
const TSO = '#1a1a30'  // shoe dark
const TSB = '#2e2e48'  // shoe toe

// Sojin
const SHR = '#7a3828'  // hair
const SHD = '#5a2818'  // hair dark
const SHL = '#a05040'  // hair highlight
const SSK = '#f5c8a0'  // skin
const SSL = '#ffddc0'  // skin light
const SSH = '#d8a070'  // skin shadow
const SEY = '#120c10'  // eye dark
const SEP = '#0e7490'  // eye iris teal
const SEL = '#ffffff'  // eye shine
const SMO = '#e06080'  // lip
const SNK = '#e8b085'  // neck
const SWC = '#f0f6ff'  // coat
const SWS = '#c8d8f0'  // coat crease
const SCY = '#0891b2'  // cyan badge
const SPN = '#2e1040'  // pants
const SPS = '#1e0830'  // pants shadow
const SSO = '#1a1a30'  // shoe
const SSH2= '#2c2c44'  // shoe highlight
const SHP = '#d4a0c0'  // hair pin

// ─── Sprite data (11 cols × 19 rows) ─────────────────────────────────────────

const T_BODY = [
  [_,   _,   TKH, TKH, TKH, TKH, TKH, _,   _,   _,   _ ],
  [_,   TKH, TKL, TKL, TKL, TKL, TKL, TKH, _,   _,   _ ],
  [_,   TKH, TSL, TSK, TSK, TSK, TSL, TKH, _,   _,   _ ],
  [_,   _,   TGL, TGR, TGL, TGL, TGR, TGL, _,   _,   _ ],
  [_,   _,   TSK, TSL, TSK, TSK, TSL, TSK, _,   _,   _ ],
  [_,   _,   TSK, TSK, TMO, TMO, TSK, TSK, _,   _,   _ ],
  [_,   _,   TSH, TNK, TNK, TNK, TNK, TSH, _,   _,   _ ],
  [_,   TWC, TWC, TNK, TNK, TNK, TNK, TWC, TWC, _,   _ ],
  [TWC, TWC, TWC, TWC, TWC, TWC, TWC, TWC, TWC, TWC, _ ],
  [TWC, TWS, TWC, TWC, TBG, TWC, TWC, TWC, TWS, TWC, _ ],
  [TWC, TWS, TWC, TWC, TWC, TWC, TWC, TWC, TWS, TWC, _ ],
  [TWC, TWS, TWC, TWC, TWC, TWC, TWC, TWC, TWS, TWC, _ ],
  [_,   TWC, TWC, TWS, TWC, TWC, TWS, TWC, TWC, _,   _ ],
  [_,   _,   TTP, TTP, TTP, TTP, TTP, TTP, _,   _,   _ ],
]
const T_LA = [  // legs frame A
  [_,   _,   TTP, TTS, _,   _,   TTP, TTS, _,   _,   _ ],
  [_,   _,   TTP, TTS, _,   _,   TTP, TTS, _,   _,   _ ],
  [_,   _,   TTP, TTS, _,   _,   TTP, _,   _,   _,   _ ],
  [_,   _,   TSO, TSB, _,   _,   TSO, TSB, _,   _,   _ ],
  [_,   TSB, TSO, TSB, _,   _,   _,   TSO, TSB, _,   _ ],
]
const T_LB = [  // legs frame B
  [_,   _,   TTP, _,   _,   TTS, TTP, TTS, _,   _,   _ ],
  [_,   _,   TTP, _,   _,   TTS, TTP, TTS, _,   _,   _ ],
  [_,   _,   _,   TTP, _,   TTS, TTP, TTS, _,   _,   _ ],
  [_,   _,   _,   TSO, TSB, _,   TSO, TSB, _,   _,   _ ],
  [_,   _,   _,   _,   TSO, TSB, TSO, TSB, _,   _,   _ ],
]

const S_BODY = [
  [_,   _,   SHR, SHR, SHR, SHR, SHR, _,   _,   _,   _ ],
  [_,   SHD, SHR, SHL, SHL, SHL, SHR, SHD, _,   _,   _ ],
  [_,   SHR, SSL, SSK, SSK, SSK, SSL, SHR, SHP, _,   _ ],
  [_,   _,   SEY, SEP, SEL, SEP, SEL, SEY, _,   _,   _ ],
  [_,   _,   SSK, SSL, SSK, SSK, SSL, SSK, _,   _,   _ ],
  [_,   _,   SSK, SSK, SMO, SMO, SSK, SSK, _,   _,   _ ],
  [_,   _,   SSH, SNK, SNK, SNK, SNK, SSH, _,   _,   _ ],
  [_,   SWC, SWC, SNK, SNK, SNK, SNK, SWC, SWC, _,   _ ],
  [SWC, SWC, SWC, SWC, SWC, SWC, SWC, SWC, SWC, SWC, _ ],
  [SWC, SWS, SWC, SWC, SCY, SWC, SWC, SWC, SWS, SWC, _ ],
  [SWC, SWS, SWC, SWC, SWC, SWC, SWC, SWC, SWS, SWC, _ ],
  [SWC, SWS, SWC, SWC, SWC, SWC, SWC, SWC, SWS, SWC, _ ],
  [_,   SWC, SWC, SWS, SWC, SWC, SWS, SWC, SWC, _,   _ ],
  [_,   _,   SPN, SPN, SPN, SPN, SPN, SPN, _,   _,   _ ],
]
const S_LA = [
  [_,   _,   SPN, SPS, _,   _,   SPN, SPS, _,   _,   _ ],
  [_,   _,   SPN, SPS, _,   _,   SPN, SPS, _,   _,   _ ],
  [_,   _,   SPN, SPS, _,   _,   SPN, _,   _,   _,   _ ],
  [_,   _,   SSO, SSH2,_,   _,   SSO, SSH2,_,   _,   _ ],
  [_,   SSH2,SSO, SSH2,_,   _,   _,   SSO, SSH2,_,   _ ],
]
const S_LB = [
  [_,   _,   SPN, _,   _,   SPS, SPN, SPS, _,   _,   _ ],
  [_,   _,   SPN, _,   _,   SPS, SPN, SPS, _,   _,   _ ],
  [_,   _,   _,   SPN, _,   SPS, SPN, SPS, _,   _,   _ ],
  [_,   _,   _,   SSO, SSH2,_,   SSO, SSH2,_,   _,   _ ],
  [_,   _,   _,   _,   SSO, SSH2,SSO, SSH2,_,   _,   _ ],
]

const TAEIN_A = [...T_BODY, ...T_LA]
const TAEIN_B = [...T_BODY, ...T_LB]
const SOJIN_A = [...S_BODY, ...S_LA]
const SOJIN_B = [...S_BODY, ...S_LB]

function mir(sp) { return sp.map(r => [...r].reverse()) }
const TAEIN_AL = mir(TAEIN_A)
const TAEIN_BL = mir(TAEIN_B)
const SOJIN_AL = mir(SOJIN_A)
const SOJIN_BL = mir(SOJIN_B)

// ─── Sprite renderer ──────────────────────────────────────────────────────────
function Sprite({ data, x, y }) {
  const px = []
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      const col = data[r][c]
      if (col) {
        px.push(<rect key={r * 12 + c} x={x + c * S} y={y + r * S}
          width={S} height={S} fill={col} shapeRendering="crispEdges" />)
      }
    }
  }
  return <>{px}</>
}

// ─── Static building ──────────────────────────────────────────────────────────
function Building() {
  const els = []

  for (let fl = 1; fl <= N_FLOORS; fl++) {
    const fy   = feetY(fl)
    const ceilY = fy - FL_H
    const slabY = ceilY - FL_SEP

    // slab
    if (slabY >= 0) {
      els.push(
        <rect key={`sl${fl}`} x={0} y={slabY} width={VW} height={FL_SEP} fill="#7a90a4" shapeRendering="crispEdges" />,
        <rect key={`slt${fl}`} x={0} y={slabY} width={VW} height={1} fill="#9ab0c4" shapeRendering="crispEdges" />
      )
    }

    // wall fill
    els.push(
      <rect key={`w${fl}`} x={COR_X0} y={ceilY} width={COR_X1 - COR_X0} height={FL_H} fill="#dde8f4" shapeRendering="crispEdges" />,
      <rect key={`wb${fl}`} x={COR_X0} y={fy - 9} width={COR_X1 - COR_X0} height={6} fill="#c8d8ea" shapeRendering="crispEdges" />,
      <rect key={`ws${fl}`} x={COR_X0} y={fy - 3} width={COR_X1 - COR_X0} height={3} fill="#b0c4d8" shapeRendering="crispEdges" />
    )

    // floor tiles
    for (let tx = COR_X0; tx < COR_X1; tx += 14) {
      els.push(
        <rect key={`ta${fl}-${tx}`} x={tx}   y={fy} width={7} height={3} fill="#d8dce0" shapeRendering="crispEdges" />,
        <rect key={`tb${fl}-${tx}`} x={tx+7} y={fy} width={7} height={3} fill="#e4e8ec" shapeRendering="crispEdges" />
      )
    }
    els.push(<rect key={`fsh${fl}`} x={COR_X0} y={fy} width={COR_X1 - COR_X0} height={1} fill="rgba(255,255,255,0.5)" />)

    // floor label
    els.push(
      <text key={`lbl${fl}`} x={COR_X0 + 5} y={ceilY + 11} fill="#7a8fa0"
        fontSize="5" fontFamily="monospace" fontWeight="bold" shapeRendering="crispEdges">
        {fl}F
      </text>
    )

    // decorations per floor
    if (fl % 2 === 1) {
      // ECG screen
      els.push(
        <rect key={`ecg${fl}`}  x={COR_X0+38} y={ceilY+7} width={26} height={16} rx="1" fill="#162040" />,
        <polyline key={`ep${fl}`}
          points={[
            [COR_X0+41,ceilY+14],[COR_X0+44,ceilY+14],[COR_X0+46,ceilY+10],
            [COR_X0+48,ceilY+18],[COR_X0+50,ceilY+14],[COR_X0+53,ceilY+14],
            [COR_X0+55,ceilY+12],[COR_X0+57,ceilY+14],[COR_X0+62,ceilY+14]
          ].map(p=>p.join(',')).join(' ')}
          fill="none" stroke="#34d399" strokeWidth="1" />,
        <rect key={`dr${fl}`}  x={COR_X1-28} y={ceilY+4} width={20} height={FL_H-4} rx="0.5" fill="#a4b8cc" />,
        <rect key={`dri${fl}`} x={COR_X1-27} y={ceilY+5} width={18} height={FL_H-6} fill="#8ca0b8" />,
        <circle key={`dk${fl}`} cx={COR_X1-9} cy={ceilY+FL_H/2} r="1.5" fill="#607080" />
      )
    } else {
      // window
      els.push(
        <rect key={`wn${fl}`}  x={COR_X0+38} y={ceilY+8} width={20} height={12} rx="0.5" fill="#b8d4f0" />,
        <rect key={`wnf${fl}`} x={COR_X0+38} y={ceilY+8} width={20} height={12} rx="0.5" fill="none" stroke="#8ab0d0" strokeWidth="0.8" />,
        <line key={`wnv${fl}`} x1={COR_X0+48} y1={ceilY+8} x2={COR_X0+48} y2={ceilY+20} stroke="#8ab0d0" strokeWidth="0.6" />,
        <line key={`wnh${fl}`} x1={COR_X0+38} y1={ceilY+14} x2={COR_X0+58} y2={ceilY+14} stroke="#8ab0d0" strokeWidth="0.6" />
      )
      // cross
      els.push(
        <rect key={`cv${fl}`} x={COR_X1-24} y={ceilY+8} width={4} height={12} rx="0.5" fill="#e74c3c" opacity="0.85" />,
        <rect key={`ch${fl}`} x={COR_X1-27} y={ceilY+12} width={10} height={4} rx="0.5" fill="#e74c3c" opacity="0.85" />
      )
    }
  }

  // staircase columns
  els.push(
    <rect key="lsc" x={0} y={0} width={STAIR_W} height={VH} fill="#b0c4d8" shapeRendering="crispEdges" />,
    <rect key="rsc" x={COR_X1} y={0} width={STAIR_W} height={VH} fill="#b0c4d8" shapeRendering="crispEdges" />,
    <rect key="lse" x={STAIR_W - 1} y={0} width={1} height={VH} fill="#8090a0" />,
    <rect key="rse" x={COR_X1} y={0} width={1} height={VH} fill="#8090a0" />
  )

  // stair steps
  for (let fl = 1; fl < N_FLOORS; fl++) {
    const yBot = feetY(fl) - 3
    const yTop = feetY(fl + 1) - 3
    const span = yBot - yTop
    for (let s = 0; s < 5; s++) {
      const sy = yBot - (s * span) / 5
      els.push(
        <rect key={`ls${fl}-${s}`} x={1}            y={sy - 2} width={STAIR_W - 2} height={2} fill="#8090a0" shapeRendering="crispEdges" />,
        <rect key={`rs${fl}-${s}`} x={COR_X1 + 1}  y={sy - 2} width={STAIR_W - 2} height={2} fill="#8090a0" shapeRendering="crispEdges" />
      )
    }
    // handrails
    els.push(
      <line key={`lrail${fl}`} x1={STAIR_W/2} y1={yBot-8} x2={STAIR_W/2} y2={yTop-8} stroke="#6a7a8a" strokeWidth="1.5" />,
      <line key={`rrail${fl}`} x1={COR_X1+STAIR_W/2} y1={yBot-8} x2={COR_X1+STAIR_W/2} y2={yTop-8} stroke="#6a7a8a" strokeWidth="1.5" />
    )
  }

  // ground
  els.push(
    <rect key="gnd"  x={0} y={feetY(1)+3} width={VW} height={VH - feetY(1) - 3} fill="#a0b0c0" shapeRendering="crispEdges" />,
    <rect key="gndh" x={0} y={feetY(1)+3} width={VW} height={2} fill="#b0c4d8" shapeRendering="crispEdges" />
  )

  return <>{els}</>
}

// ─── Waypoint system ──────────────────────────────────────────────────────────
const SPR_W = 11 * S   // sprite width in px (22)
const SPR_H = 19 * S   // sprite height in px (38)

// Build full path: up floors 1→6, down floors 6→1
function buildPath() {
  const WALK_SPD = 72   // px/s across corridor
  const CLMB_SPD = 38   // px/s climbing stairs
  const segs = []
  const charY = fl => feetY(fl) - SPR_H

  // going up
  for (let fl = 1; fl <= N_FLOORS - 1; fl++) {
    const right = fl % 2 === 1
    const x0 = right ? COR_X0 : COR_X1 - SPR_W
    const x1 = right ? COR_X1 - SPR_W : COR_X0
    segs.push({ x0, y0: charY(fl), x1, y1: charY(fl), facing: right ? 'r' : 'l', spd: WALK_SPD })
    const sx = right ? COR_X1 - SPR_W : COR_X0
    segs.push({ x0: sx, y0: charY(fl), x1: sx, y1: charY(fl + 1), facing: right ? 'r' : 'l', spd: CLMB_SPD })
  }
  // top floor
  segs.push({ x0: COR_X0, y0: charY(6), x1: COR_X1 - SPR_W, y1: charY(6), facing: 'r', spd: WALK_SPD })
  // going down
  for (let fl = N_FLOORS; fl >= 2; fl--) {
    const left = fl % 2 === 0
    const x0 = left ? COR_X1 - SPR_W : COR_X0
    const x1 = left ? COR_X0 : COR_X1 - SPR_W
    segs.push({ x0, y0: charY(fl), x1, y1: charY(fl), facing: left ? 'l' : 'r', spd: WALK_SPD })
    const sx = left ? COR_X0 : COR_X1 - SPR_W
    segs.push({ x0: sx, y0: charY(fl), x1: sx, y1: charY(fl - 1), facing: left ? 'l' : 'r', spd: CLMB_SPD })
  }

  // attach duration
  return segs.map(seg => ({
    ...seg,
    dur: Math.hypot(seg.x1 - seg.x0, seg.y1 - seg.y0) / seg.spd,
  }))
}

const PATH     = buildPath()
const TOTAL_MS = PATH.reduce((s, seg) => s + seg.dur * 1000, 0)

function getPosAtMs(ms) {
  const t = ((ms % TOTAL_MS) + TOTAL_MS) % TOTAL_MS
  let elapsed = 0
  for (const seg of PATH) {
    const segMs = seg.dur * 1000
    if (t < elapsed + segMs) {
      const frac = segMs > 0 ? (t - elapsed) / segMs : 0
      return {
        x: Math.round(seg.x0 + (seg.x1 - seg.x0) * frac),
        y: Math.round(seg.y0 + (seg.y1 - seg.y0) * frac),
        facing: seg.facing,
      }
    }
    elapsed += segMs
  }
  return { x: PATH[0].x0, y: PATH[0].y0, facing: 'r' }
}

// ─── XP particle ─────────────────────────────────────────────────────────────
let _pid = 0

const XP_ANCHORS = [
  { x: COR_X0 + 52, fl: 1 }, { x: COR_X0 + 52, fl: 2 },
  { x: COR_X1 - 20, fl: 3 }, { x: COR_X0 + 80, fl: 4 },
  { x: COR_X1 - 20, fl: 5 }, { x: COR_X0 + 52, fl: 6 },
]

// ─── Main component ───────────────────────────────────────────────────────────
export default function InternPixelArt() {
  const [ms, setMs]       = useState(0)
  const [frame, setFrame] = useState(0)
  const [particles, setParticles] = useState([])
  const startMs = Date.now()

  // Animation loop via setInterval (reliable across all browsers)
  useEffect(() => {
    const t0 = Date.now()
    const iv = setInterval(() => setMs(Date.now() - t0), 30)  // ~33fps
    return () => clearInterval(iv)
  }, [])

  // Walk frame toggle
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => 1 - f), 160)
    return () => clearInterval(iv)
  }, [])

  // XP particles
  useEffect(() => {
    let pid = 0
    const iv = setInterval(() => {
      const id = ++pid
      const anchor = XP_ANCHORS[id % XP_ANCHORS.length]
      const x = anchor.x + (Math.random() * 14 - 7)
      const y = feetY(anchor.fl) - SPR_H - 6
      const isTaein = id % 2 === 0
      setParticles(prev => [...prev.slice(-8), { id, x, y, isTaein }])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1000)
    }, 1300)
    return () => clearInterval(iv)
  }, [])

  const taein = getPosAtMs(ms)
  const sojin = getPosAtMs(ms + TOTAL_MS * 0.5)

  function sprite(pos, who) {
    const fr = frame
    if (who === 'taein') return pos.facing === 'r' ? (fr ? TAEIN_B : TAEIN_A) : (fr ? TAEIN_BL : TAEIN_AL)
    return pos.facing === 'r' ? (fr ? SOJIN_B : SOJIN_A) : (fr ? SOJIN_BL : SOJIN_AL)
  }

  return (
    <div style={{ lineHeight: 0 }}>
      <svg
        width="100%"
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      >
        <Building />

        <Sprite data={sprite(taein, 'taein')} x={taein.x} y={taein.y} />
        <Sprite data={sprite(sojin, 'sojin')} x={sojin.x} y={sojin.y} />

        {particles.map(p => (
          <text key={p.id} x={p.x} y={p.y}
            textAnchor="middle" fontSize="7" fontWeight="900"
            fontFamily="monospace" fill={p.isTaein ? '#2563eb' : '#0891b2'}
            className="xp-particle">
            +XP
          </text>
        ))}
      </svg>
    </div>
  )
}
