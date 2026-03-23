export default function InternPixelArt() {
  const VW = 250, VH = 346
  const N_FLOORS = 6
  const FL_H = 48, FL_SEP = 6, FL_UNIT = 54
  const STAIR_W = 22
  const COR_X0 = STAIR_W, COR_X1 = VW - STAIR_W

  function feetY(floor) {
    return (N_FLOORS - floor) * FL_UNIT + FL_SEP + FL_H
  }

  const floors = []
  for (let fl = 1; fl <= N_FLOORS; fl++) {
    const fy = feetY(fl)
    const ceilY = fy - FL_H
    floors.push(
      <rect key={`w${fl}`} x={COR_X0} y={ceilY} width={COR_X1 - COR_X0} height={FL_H} fill="#dde8f4" />,
      <rect key={`f${fl}`} x={COR_X0} y={fy} width={COR_X1 - COR_X0} height={FL_SEP} fill="#7a90a4" />,
      <text key={`l${fl}`} x={COR_X0 + 5} y={ceilY + 14} fill="#7a8fa0" fontSize="8" fontFamily="monospace">{fl}F</text>
    )
  }

  return (
    <div style={{ lineHeight: 0 }}>
      <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} style={{ display: 'block' }}>
        <rect x={0} y={0} width={VW} height={VH} fill="#b0c4d8" />
        {floors}
      </svg>
    </div>
  )
}
