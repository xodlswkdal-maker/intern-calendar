import { useEffect, useRef } from 'react'

const S = 2
const VW = 250
const N_FLOORS = 6
const FL_H = 48, FL_SEP = 6, FL_UNIT = 54
const VH = N_FLOORS * FL_UNIT + 22
const STAIR_W = 22
const COR_X0 = STAIR_W, COR_X1 = VW - STAIR_W
const SPR_W = 11 * S, SPR_H = 19 * S

function feetY(fl) {
  return (N_FLOORS - fl) * FL_UNIT + FL_SEP + FL_H
}

// ── palette ───────────────────────────────────────────────────────────────────
const _ = null
const TKH='#1a0e08',TKL='#2e1810',TSK='#f3c28a',TSL='#fad5a5',TSH='#d99060'
const TGL='#1a1008',TGR='#c5ddf0',TMO='#c04040',TNK='#e8a87a'
const TWC='#eef3ff',TWS='#ccd8f0',TBG='#1d4ed8',TTP='#263244',TTS='#1a2233'
const TSO='#1a1a30',TSB='#2e2e48'
const SHR='#7a3828',SHD='#5a2818',SHL='#a05040',SSK='#f5c8a0',SSL='#ffddc0'
const SSH='#d8a070',SEY='#120c10',SEP='#0e7490',SEL='#ffffff',SMO='#e06080'
const SNK='#e8b085',SWC='#f0f6ff',SWS='#c8d8f0',SCY='#0891b2',SPN='#2e1040'
const SPS='#1e0830',SSO='#1a1a30',SSH2='#2c2c44',SHP='#d4a0c0'

// ── sprites ───────────────────────────────────────────────────────────────────
const TAEIN = [
  [_,_,TKH,TKH,TKH,TKH,TKH,_,_,_,_],
  [_,TKH,TKL,TKL,TKL,TKL,TKL,TKH,_,_,_],
  [_,TKH,TSL,TSK,TSK,TSK,TSL,TKH,_,_,_],
  [_,_,TGL,TGR,TGL,TGL,TGR,TGL,_,_,_],
  [_,_,TSK,TSL,TSK,TSK,TSL,TSK,_,_,_],
  [_,_,TSK,TSK,TMO,TMO,TSK,TSK,_,_,_],
  [_,_,TSH,TNK,TNK,TNK,TNK,TSH,_,_,_],
  [_,TWC,TWC,TNK,TNK,TNK,TNK,TWC,TWC,_,_],
  [TWC,TWC,TWC,TWC,TWC,TWC,TWC,TWC,TWC,TWC,_],
  [TWC,TWS,TWC,TWC,TBG,TWC,TWC,TWC,TWS,TWC,_],
  [TWC,TWS,TWC,TWC,TWC,TWC,TWC,TWC,TWS,TWC,_],
  [TWC,TWS,TWC,TWC,TWC,TWC,TWC,TWC,TWS,TWC,_],
  [_,TWC,TWC,TWS,TWC,TWC,TWS,TWC,TWC,_,_],
  [_,_,TTP,TTP,TTP,TTP,TTP,TTP,_,_,_],
  [_,_,TTP,TTS,_,_,TTP,TTS,_,_,_],
  [_,_,TTP,TTS,_,_,TTP,TTS,_,_,_],
  [_,_,TTP,TTS,_,_,TTP,_,_,_,_],
  [_,_,TSO,TSB,_,_,TSO,TSB,_,_,_],
  [_,TSB,TSO,TSB,_,_,_,TSO,TSB,_,_],
]
const SOJIN = [
  [_,_,SHR,SHR,SHR,SHR,SHR,_,_,_,_],
  [_,SHD,SHR,SHL,SHL,SHL,SHR,SHD,_,_,_],
  [_,SHR,SSL,SSK,SSK,SSK,SSL,SHR,SHP,_,_],
  [_,_,SEY,SEP,SEL,SEP,SEL,SEY,_,_,_],
  [_,_,SSK,SSL,SSK,SSK,SSL,SSK,_,_,_],
  [_,_,SSK,SSK,SMO,SMO,SSK,SSK,_,_,_],
  [_,_,SSH,SNK,SNK,SNK,SNK,SSH,_,_,_],
  [_,SWC,SWC,SNK,SNK,SNK,SNK,SWC,SWC,_,_],
  [SWC,SWC,SWC,SWC,SWC,SWC,SWC,SWC,SWC,SWC,_],
  [SWC,SWS,SWC,SWC,SCY,SWC,SWC,SWC,SWS,SWC,_],
  [SWC,SWS,SWC,SWC,SWC,SWC,SWC,SWC,SWS,SWC,_],
  [SWC,SWS,SWC,SWC,SWC,SWC,SWC,SWC,SWS,SWC,_],
  [_,SWC,SWC,SWS,SWC,SWC,SWS,SWC,SWC,_,_],
  [_,_,SPN,SPN,SPN,SPN,SPN,SPN,_,_,_],
  [_,_,SPN,SPS,_,_,SPN,SPS,_,_,_],
  [_,_,SPN,SPS,_,_,SPN,SPS,_,_,_],
  [_,_,SPN,SPS,_,_,SPN,_,_,_,_],
  [_,_,SSO,SSH2,_,_,SSO,SSH2,_,_,_],
  [_,SSH2,SSO,SSH2,_,_,_,SSO,SSH2,_,_],
]

// Build SVG pixel rects as an SVG string (for innerHTML approach)
function spriteToRects(data, id) {
  let s = '<g id="' + id + '">'
  for (let r = 0; r < data.length; r++)
    for (let c = 0; c < data[r].length; c++)
      if (data[r][c])
        s += '<rect x="'+(c*S)+'" y="'+(r*S)+'" width="'+S+'" height="'+S+'" fill="'+data[r][c]+'" shape-rendering="crispEdges"/>'
  s += '</g>'
  return s
}

// ── waypoints ─────────────────────────────────────────────────────────────────
function buildPath() {
  const WS = 72, CS = 38
  const charY = fl => feetY(fl) - SPR_H
  const segs = []
  for (let fl = 1; fl < N_FLOORS; fl++) {
    const right = fl % 2 === 1
    const x0 = right ? COR_X0 : COR_X1 - SPR_W
    const x1 = right ? COR_X1 - SPR_W : COR_X0
    segs.push({ x0, y0: charY(fl), x1, y1: charY(fl), facing: right ? 'r' : 'l', spd: WS })
    const sx = right ? COR_X1 - SPR_W : COR_X0
    segs.push({ x0: sx, y0: charY(fl), x1: sx, y1: charY(fl+1), facing: right ? 'r' : 'l', spd: CS })
  }
  segs.push({ x0: COR_X0, y0: charY(6), x1: COR_X1-SPR_W, y1: charY(6), facing: 'r', spd: WS })
  for (let fl = N_FLOORS; fl >= 2; fl--) {
    const left = fl % 2 === 0
    const x0 = left ? COR_X1-SPR_W : COR_X0
    const x1 = left ? COR_X0 : COR_X1-SPR_W
    segs.push({ x0, y0: charY(fl), x1, y1: charY(fl), facing: left ? 'l' : 'r', spd: WS })
    const sx = left ? COR_X0 : COR_X1-SPR_W
    segs.push({ x0: sx, y0: charY(fl), x1: sx, y1: charY(fl-1), facing: left ? 'l' : 'r', spd: CS })
  }
  return segs.map(seg => ({ ...seg, dur: Math.hypot(seg.x1-seg.x0, seg.y1-seg.y0)/seg.spd*1000 }))
}

const PATH = buildPath()
const TOTAL_MS = PATH.reduce((s, seg) => s + seg.dur, 0)

function getPosAtMs(ms) {
  const t = ((ms % TOTAL_MS) + TOTAL_MS) % TOTAL_MS
  let elapsed = 0
  for (const seg of PATH) {
    if (t < elapsed + seg.dur) {
      const frac = seg.dur > 0 ? (t - elapsed) / seg.dur : 0
      return { x: Math.round(seg.x0+(seg.x1-seg.x0)*frac), y: Math.round(seg.y0+(seg.y1-seg.y0)*frac), facing: seg.facing }
    }
    elapsed += seg.dur
  }
  return { x: PATH[0].x0, y: PATH[0].y0, facing: 'r' }
}

// ── building (static SVG string) ──────────────────────────────────────────────
function buildingHTML() {
  let s = ''
  for (let fl = 1; fl <= N_FLOORS; fl++) {
    const fy = feetY(fl), ceilY = fy - FL_H, slabY = ceilY - FL_SEP
    if (slabY >= 0) s += '<rect x="0" y="'+slabY+'" width="'+VW+'" height="'+FL_SEP+'" fill="#7a90a4" shape-rendering="crispEdges"/>'
    s += '<rect x="'+COR_X0+'" y="'+ceilY+'" width="'+(COR_X1-COR_X0)+'" height="'+FL_H+'" fill="#dde8f4" shape-rendering="crispEdges"/>'
    s += '<rect x="'+COR_X0+'" y="'+(fy-9)+'" width="'+(COR_X1-COR_X0)+'" height="6" fill="#c8d8ea" shape-rendering="crispEdges"/>'
    s += '<rect x="'+COR_X0+'" y="'+(fy-3)+'" width="'+(COR_X1-COR_X0)+'" height="3" fill="#b0c4d8" shape-rendering="crispEdges"/>'
    s += '<text x="'+(COR_X0+4)+'" y="'+(ceilY+11)+'" fill="#7a8fa0" font-size="5" font-family="monospace" font-weight="bold">'+fl+'F</text>'
    for (let tx = COR_X0; tx < COR_X1; tx += 14) {
      s += '<rect x="'+tx+'" y="'+fy+'" width="7" height="4" fill="#d8dce0" shape-rendering="crispEdges"/>'
      s += '<rect x="'+(tx+7)+'" y="'+fy+'" width="7" height="4" fill="#e4e8ec" shape-rendering="crispEdges"/>'
    }
    if (fl % 2 === 1) {
      s += '<rect x="'+(COR_X0+38)+'" y="'+(ceilY+7)+'" width="26" height="16" rx="1" fill="#162040"/>'
      s += '<polyline fill="none" stroke="#34d399" stroke-width="1" points="'+(COR_X0+41)+','+(ceilY+14)+' '+(COR_X0+44)+','+(ceilY+14)+' '+(COR_X0+46)+','+(ceilY+10)+' '+(COR_X0+48)+','+(ceilY+18)+' '+(COR_X0+50)+','+(ceilY+14)+' '+(COR_X0+62)+','+(ceilY+14)+'"/>'
      s += '<rect x="'+(COR_X1-28)+'" y="'+(ceilY+4)+'" width="20" height="'+(FL_H-4)+'" rx="0.5" fill="#a4b8cc"/>'
      s += '<rect x="'+(COR_X1-27)+'" y="'+(ceilY+5)+'" width="18" height="'+(FL_H-6)+'" fill="#8ca0b8"/>'
      s += '<circle cx="'+(COR_X1-9)+'" cy="'+(ceilY+FL_H/2)+'" r="1.5" fill="#607080"/>'
    } else {
      s += '<rect x="'+(COR_X0+38)+'" y="'+(ceilY+8)+'" width="20" height="12" rx="0.5" fill="#b8d4f0"/>'
      s += '<rect x="'+(COR_X1-24)+'" y="'+(ceilY+8)+'" width="4" height="12" rx="0.5" fill="#e74c3c" opacity="0.85"/>'
      s += '<rect x="'+(COR_X1-27)+'" y="'+(ceilY+12)+'" width="10" height="4" rx="0.5" fill="#e74c3c" opacity="0.85"/>'
    }
  }
  s += '<rect x="0" y="0" width="'+STAIR_W+'" height="'+VH+'" fill="#b0c4d8" shape-rendering="crispEdges"/>'
  s += '<rect x="'+COR_X1+'" y="0" width="'+STAIR_W+'" height="'+VH+'" fill="#b0c4d8" shape-rendering="crispEdges"/>'
  s += '<rect x="'+(STAIR_W-1)+'" y="0" width="1" height="'+VH+'" fill="#8090a0"/>'
  s += '<rect x="'+COR_X1+'" y="0" width="1" height="'+VH+'" fill="#8090a0"/>'
  for (let fl = 1; fl < N_FLOORS; fl++) {
    const yB = feetY(fl)-3, yT = feetY(fl+1)-3, span = yB-yT
    for (let st = 0; st < 5; st++) {
      const sy = yB - st*span/5
      s += '<rect x="1" y="'+(sy-2)+'" width="'+(STAIR_W-2)+'" height="2" fill="#8090a0" shape-rendering="crispEdges"/>'
      s += '<rect x="'+(COR_X1+1)+'" y="'+(sy-2)+'" width="'+(STAIR_W-2)+'" height="2" fill="#8090a0" shape-rendering="crispEdges"/>'
    }
  }
  const gy = feetY(1)+3
  s += '<rect x="0" y="'+gy+'" width="'+VW+'" height="'+(VH-gy)+'" fill="#a0b0c0" shape-rendering="crispEdges"/>'
  s += '<rect x="0" y="'+gy+'" width="'+VW+'" height="2" fill="#b0c4d8" shape-rendering="crispEdges"/>'
  return s
}

const BUILDING_HTML = buildingHTML()
const TAEIN_RECTS  = spriteToRects(TAEIN, 'ts')
const SOJIN_RECTS  = spriteToRects(SOJIN, 'ss')

// ── main component ────────────────────────────────────────────────────────────
export default function InternPixelArt() {
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Inject static building once
    const bgEl = svg.querySelector('#bg')
    if (bgEl) bgEl.innerHTML = BUILDING_HTML

    // Inject sprite groups
    const tg = svg.querySelector('#tg')
    const sg = svg.querySelector('#sg')
    if (tg) tg.innerHTML = TAEIN_RECTS.replace('<g id="ts">', '').replace('</g>', '')
    if (sg) sg.innerHTML = SOJIN_RECTS.replace('<g id="ss">', '').replace('</g>', '')

    const t0 = performance.now()
    let animId

    function tick(now) {
      const ms = now - t0

      // Position update
      const tp = getPosAtMs(ms)
      const sp = getPosAtMs(ms + TOTAL_MS * 0.5)

      if (tg) {
        if (tp.facing === 'l')
          tg.setAttribute('transform', 'translate('+(tp.x + SPR_W)+','+tp.y+') scale(-1,1)')
        else
          tg.setAttribute('transform', 'translate('+tp.x+','+tp.y+')')
      }
      if (sg) {
        if (sp.facing === 'l')
          sg.setAttribute('transform', 'translate('+(sp.x + SPR_W)+','+sp.y+') scale(-1,1)')
        else
          sg.setAttribute('transform', 'translate('+sp.x+','+sp.y+')')
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div style={{ lineHeight: 0 }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={'0 0 ' + VW + ' ' + VH}
        style={{ display: 'block', imageRendering: 'pixelated' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="bg" />
        <g id="tg" />
        <g id="sg" />
      </svg>
    </div>
  )
}
