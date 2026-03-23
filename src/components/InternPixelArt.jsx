import { useState, useEffect } from 'react'

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

const _ = null
const TKH='#1a0e08',TKL='#2e1810',TSK='#f3c28a',TSL='#fad5a5',TSH='#d99060'
const TGL='#1a1008',TGR='#c5ddf0',TMO='#c04040',TNK='#e8a87a'
const TWC='#eef3ff',TWS='#ccd8f0',TBG='#1d4ed8',TTP='#263244',TTS='#1a2233'
const TSO='#1a1a30',TSB='#2e2e48'
const SHR='#7a3828',SHD='#5a2818',SHL='#a05040',SSK='#f5c8a0',SSL='#ffddc0'
const SSH='#d8a070',SEY='#120c10',SEP='#0e7490',SEL='#ffffff',SMO='#e06080'
const SNK='#e8b085',SWC='#f0f6ff',SWS='#c8d8f0',SCY='#0891b2',SPN='#2e1040'
const SPS='#1e0830',SSO='#1a1a30',SSH2='#2c2c44',SHP='#d4a0c0'

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
const TAEIN_L = TAEIN.map(r => [...r].reverse())
const SOJIN_L = SOJIN.map(r => [...r].reverse())

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

function Building() {
  const els = []
  for (let fl = 1; fl <= N_FLOORS; fl++) {
    const fy = feetY(fl), ceilY = fy - FL_H, slabY = ceilY - FL_SEP
    if (slabY >= 0) els.push(<rect key={'sl'+fl} x={0} y={slabY} width={VW} height={FL_SEP} fill="#7a90a4" shapeRendering="crispEdges" />)
    els.push(
      <rect key={'w'+fl}  x={COR_X0} y={ceilY} width={COR_X1-COR_X0} height={FL_H} fill="#dde8f4" shapeRendering="crispEdges" />,
      <rect key={'wb'+fl} x={COR_X0} y={fy-9}  width={COR_X1-COR_X0} height={6}   fill="#c8d8ea" shapeRendering="crispEdges" />,
      <rect key={'ws'+fl} x={COR_X0} y={fy-3}  width={COR_X1-COR_X0} height={3}   fill="#b0c4d8" shapeRendering="crispEdges" />,
      <text key={'l'+fl}  x={COR_X0+4} y={ceilY+11} fill="#7a8fa0" fontSize="5" fontFamily="monospace" fontWeight="bold">{fl}F</text>
    )
    for (let tx = COR_X0; tx < COR_X1; tx += 14) {
      els.push(
        <rect key={'ta'+fl+'-'+tx} x={tx}   y={fy} width={7} height={4} fill="#d8dce0" shapeRendering="crispEdges" />,
        <rect key={'tb'+fl+'-'+tx} x={tx+7} y={fy} width={7} height={4} fill="#e4e8ec" shapeRendering="crispEdges" />
      )
    }
    if (fl % 2 === 1) {
      els.push(
        <rect key={'em'+fl} x={COR_X0+38} y={ceilY+7} width={26} height={16} rx="1" fill="#162040" />,
        <polyline key={'ep'+fl} fill="none" stroke="#34d399" strokeWidth="1"
          points={(COR_X0+41)+','+(ceilY+14)+' '+(COR_X0+44)+','+(ceilY+14)+' '+(COR_X0+46)+','+(ceilY+10)+' '+(COR_X0+48)+','+(ceilY+18)+' '+(COR_X0+50)+','+(ceilY+14)+' '+(COR_X0+62)+','+(ceilY+14)} />,
        <rect key={'dr'+fl}  x={COR_X1-28} y={ceilY+4} width={20} height={FL_H-4} rx="0.5" fill="#a4b8cc" />,
        <rect key={'dri'+fl} x={COR_X1-27} y={ceilY+5} width={18} height={FL_H-6} fill="#8ca0b8" />,
        <circle key={'dk'+fl} cx={COR_X1-9} cy={ceilY+FL_H/2} r="1.5" fill="#607080" />
      )
    } else {
      els.push(
        <rect key={'wn'+fl} x={COR_X0+38} y={ceilY+8} width={20} height={12} rx="0.5" fill="#b8d4f0" />,
        <rect key={'cv'+fl} x={COR_X1-24} y={ceilY+8}  width={4}  height={12} rx="0.5" fill="#e74c3c" opacity="0.85" />,
        <rect key={'ch'+fl} x={COR_X1-27} y={ceilY+12} width={10} height={4}  rx="0.5" fill="#e74c3c" opacity="0.85" />
      )
    }
  }
  els.push(
    <rect key="lsc" x={0}      y={0} width={STAIR_W} height={VH} fill="#b0c4d8" shapeRendering="crispEdges" />,
    <rect key="rsc" x={COR_X1} y={0} width={STAIR_W} height={VH} fill="#b0c4d8" shapeRendering="crispEdges" />
  )
  for (let fl = 1; fl < N_FLOORS; fl++) {
    const yB = feetY(fl)-3, yT = feetY(fl+1)-3, span = yB-yT
    for (let s = 0; s < 5; s++) {
      const sy = yB - s*span/5
      els.push(
        <rect key={'ls'+fl+'-'+s} x={1}        y={sy-2} width={STAIR_W-2} height={2} fill="#8090a0" shapeRendering="crispEdges" />,
        <rect key={'rs'+fl+'-'+s} x={COR_X1+1} y={sy-2} width={STAIR_W-2} height={2} fill="#8090a0" shapeRendering="crispEdges" />
      )
    }
  }
  els.push(
    <rect key="gnd"  x={0} y={feetY(1)+3} width={VW} height={VH-feetY(1)-3} fill="#a0b0c0" shapeRendering="crispEdges" />,
    <rect key="gndh" x={0} y={feetY(1)+3} width={VW} height={2}             fill="#b0c4d8" shapeRendering="crispEdges" />
  )
  return <>{els}</>
}

function Sprite({ data, x, y }) {
  const px = []
  for (let r = 0; r < data.length; r++)
    for (let c = 0; c < data[r].length; c++)
      if (data[r][c])
        px.push(<rect key={r*12+c} x={x+c*S} y={y+r*S} width={S} height={S} fill={data[r][c]} shapeRendering="crispEdges" />)
  return <>{px}</>
}

const XP_SPOTS = [
  { x: COR_X0+52, fl: 1 }, { x: COR_X0+52, fl: 2 },
  { x: COR_X1-20, fl: 3 }, { x: COR_X0+80, fl: 4 },
  { x: COR_X1-20, fl: 5 }, { x: COR_X0+52, fl: 6 },
]

export default function InternPixelArt() {
  const [ms, setMs] = useState(0)
  const [frame, setFrame] = useState(0)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const t0 = Date.now()
    const iv = setInterval(() => setMs(Date.now() - t0), 33)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setFrame(f => 1 - f), 160)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    let pid = 0
    const iv = setInterval(() => {
      const id = ++pid
      const spot = XP_SPOTS[id % XP_SPOTS.length]
      const y = feetY(spot.fl) - SPR_H - 6
      setParticles(prev => [...prev.slice(-8), { id, x: spot.x, y, isTaein: id%2===0 }])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1000)
    }, 1300)
    return () => clearInterval(iv)
  }, [])

  const tp = getPosAtMs(ms)
  const sp = getPosAtMs(ms + TOTAL_MS * 0.5)

  return (
    <div style={{ lineHeight: 0 }}>
      <svg width="100%" viewBox={'0 0 '+VW+' '+VH} style={{ display:'block', imageRendering:'pixelated' }}>
        <Building />
        <Sprite data={tp.facing==='r' ? TAEIN : TAEIN_L} x={tp.x} y={tp.y} />
        <Sprite data={sp.facing==='r' ? SOJIN : SOJIN_L} x={sp.x} y={sp.y} />
        {particles.map(p => (
          <text key={p.id} x={p.x} y={p.y} textAnchor="middle"
            fontSize="7" fontWeight="900" fontFamily="monospace"
            fill={p.isTaein ? '#2563eb' : '#0891b2'}
            className="xp-particle">+XP</text>
        ))}
      </svg>
    </div>
  )
}
