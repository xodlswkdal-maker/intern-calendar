import { useState, useEffect } from 'react'

const S = 2
const VW = 250
const N_FLOORS = 6
const FL_H = 48, FL_SEP = 6, FL_UNIT = 54
const VH = N_FLOORS * FL_UNIT + 22
const STAIR_W = 22
const COR_X0 = STAIR_W, COR_X1 = VW - STAIR_W

function feetY(fl) {
  return (N_FLOORS - fl) * FL_UNIT + FL_SEP + FL_H
}

// --- palette ---
const _ = null
const TKH='#1a0e08',TKL='#2e1810',TSK='#f3c28a',TSL='#fad5a5',TSH='#d99060'
const TEY='#180c0a',TGL='#1a1008',TGR='#c5ddf0',TMO='#c04040',TNK='#e8a87a'
const TWC='#eef3ff',TWS='#ccd8f0',TBG='#1d4ed8',TTP='#263244',TTS='#1a2233'
const TSO='#1a1a30',TSB='#2e2e48'
const SHR='#7a3828',SHD='#5a2818',SHL='#a05040',SSK='#f5c8a0',SSL='#ffddc0'
const SSH='#d8a070',SEY='#120c10',SEP='#0e7490',SEL='#ffffff',SMO='#e06080'
const SNK='#e8b085',SWC='#f0f6ff',SWS='#c8d8f0',SCY='#0891b2',SPN='#2e1040'
const SPS='#1e0830',SSO='#1a1a30',SSH2='#2c2c44',SHP='#d4a0c0'

const T_BODY = [
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

const S_BODY = [
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

function Sprite({ data, x, y }) {
  const px = []
  for (let r = 0; r < data.length; r++)
    for (let c = 0; c < data[r].length; c++)
      if (data[r][c])
        px.push(<rect key={r*12+c} x={x+c*S} y={y+r*S} width={S} height={S} fill={data[r][c]} shapeRendering="crispEdges" />)
  return <>{px}</>
}

export default function InternPixelArt() {
  const floors = []
  for (let fl = 1; fl <= N_FLOORS; fl++) {
    const fy = feetY(fl)
    const ceilY = fy - FL_H
    const slabY = ceilY - FL_SEP
    if (slabY >= 0) floors.push(<rect key={`sl${fl}`} x={0} y={slabY} width={VW} height={FL_SEP} fill="#7a90a4" />)
    floors.push(
      <rect key={`w${fl}`} x={COR_X0} y={ceilY} width={COR_X1-COR_X0} height={FL_H} fill="#dde8f4" />,
      <rect key={`f${fl}`} x={COR_X0} y={fy-3} width={COR_X1-COR_X0} height={3} fill="#b0c4d8" />,
      <text key={`l${fl}`} x={COR_X0+4} y={ceilY+11} fill="#7a8fa0" fontSize="5" fontFamily="monospace" fontWeight="bold">{fl}F</text>
    )
  }
  floors.push(
    <rect key="lsc" x={0} y={0} width={STAIR_W} height={VH} fill="#b0c4d8" />,
    <rect key="rsc" x={COR_X1} y={0} width={STAIR_W} height={VH} fill="#b0c4d8" />
  )

  // Static characters for now
  const taeinY = feetY(1) - 19*S
  const sojinY = feetY(3) - 19*S

  return (
    <div style={{ lineHeight: 0 }}>
      <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} style={{ display:'block', imageRendering:'pixelated' }}>
        {floors}
        <Sprite data={T_BODY} x={COR_X0 + 10} y={taeinY} />
        <Sprite data={S_BODY} x={COR_X0 + 80} y={sojinY} />
      </svg>
    </div>
  )
}
