import { useState, useEffect, useRef } from 'react'

const SCALE = 4
const VW = 320
const VH = 110
const FLOOR_Y = 74
const CHAR_Y = FLOOR_Y - 12 * SCALE  // feet at floor: 74 - 48 = 26

// ── Palette ──────────────────────────────────────────────────────────────────
const _ = null
const KH = '#1a120b'  // taein hair
const SH = '#7a4030'  // sojin hair
const SK = '#f4c195'  // skin
const EY = '#2d1b0e'  // eyes
const MO = '#c0392b'  // mouth
const WC = '#f0f4ff'  // white coat
const CS = '#c8d4e8'  // coat shadow
const TB = '#2563eb'  // taein blue trim
const ST = '#0891b2'  // sojin teal trim
const TP = '#374151'  // taein pants
const SQ = '#0e7490'  // sojin pants
const SH2= '#1a1a2e'  // shoes

// ── Sprite base bodies ────────────────────────────────────────────────────────
const T_BODY = [
  [_,  _,  KH, KH, KH, KH, _,  _ ],
  [_,  KH, KH, KH, KH, KH, _,  _ ],
  [_,  SK, SK, SK, SK, SK, SK, _ ],
  [_,  SK, EY, SK, SK, EY, SK, _ ],
  [_,  SK, SK, MO, MO, SK, SK, _ ],
  [WC, WC, WC, SK, SK, WC, WC, WC],
  [TB, WC, WC, WC, WC, WC, WC, _ ],
  [TB, WC, CS, CS, CS, WC, WC, _ ],
  [TB, WC, WC, WC, WC, WC, WC, _ ],
]
const S_BODY = [
  [_,  _,  SH, SH, SH, SH, _,  _ ],
  [_,  SH, SH, SH, SH, SH, SH, _ ],
  [_,  SK, SK, SK, SK, SK, SK, _ ],
  [_,  SK, EY, SK, SK, EY, SK, _ ],
  [_,  SK, SK, MO, SK, SK, SK, _ ],
  [WC, WC, WC, SK, SK, WC, WC, WC],
  [ST, WC, WC, WC, WC, WC, WC, _ ],
  [ST, WC, CS, CS, CS, WC, WC, _ ],
  [ST, WC, WC, WC, WC, WC, WC, _ ],
]

// Walking frames: A = left step, B = right step
const T_LEGS_A = [
  [_,  TP, TP, TP, TP, TP, _,  _ ],
  [TP, _,  _,  _,  TP, _,  _,  _ ],
  [SH2,_,  _,  _,  SH2,_,  _,  _ ],
]
const T_LEGS_B = [
  [_,  TP, TP, TP, TP, TP, _,  _ ],
  [_,  _,  TP, _,  _,  TP, _,  _ ],
  [_,  _,  SH2,_,  _,  SH2,_,  _ ],
]
const S_LEGS_A = [
  [_,  SQ, SQ, SQ, SQ, SQ, _,  _ ],
  [SK, _,  _,  _,  SK, _,  _,  _ ],
  [SH2,_,  _,  _,  SH2,_,  _,  _ ],
]
const S_LEGS_B = [
  [_,  SQ, SQ, SQ, SQ, SQ, _,  _ ],
  [_,  _,  SK, _,  _,  SK, _,  _ ],
  [_,  _,  SH2,_,  _,  SH2,_,  _ ],
]

const TAEIN_A = [...T_BODY, ...T_LEGS_A]
const TAEIN_B = [...T_BODY, ...T_LEGS_B]
const SOJIN_A = [...S_BODY, ...S_LEGS_A]
const SOJIN_B = [...S_BODY, ...S_LEGS_B]

// Mirror sprite horizontally (for left-facing character)
const mir = s => s.map(row => [...row].reverse())
const SOJIN_A_L = mir(SOJIN_A)
const SOJIN_B_L = mir(SOJIN_B)

// ── Sprite renderer ───────────────────────────────────────────────────────────
function Sprite({ data, x, y }) {
  return (
    <>
      {data.flatMap((row, ri) =>
        row.map((color, ci) =>
          color
            ? <rect key={`${ri}-${ci}`}
                x={x + ci * SCALE} y={y + ri * SCALE}
                width={SCALE} height={SCALE}
                fill={color} shapeRendering="crispEdges" />
            : null
        )
      )}
    </>
  )
}

// ── Corridor background ───────────────────────────────────────────────────────
function CorridorBg() {
  return (
    <>
      {/* Ceiling */}
      <rect x="0" y="0" width={VW} height="11" fill="#bccede" />
      {/* Ceiling tiles */}
      {[0,40,80,120,160,200,240,280].map(x =>
        <rect key={x} x={x} y="0" width="38" height="11" fill="#c4d4e4" stroke="#b0c4d8" strokeWidth="0.3" />
      )}
      {/* Fluorescent lights */}
      {[6, 86, 166, 246].map(x => (
        <g key={x}>
          <rect x={x} y="2" width="56" height="4" rx="1" fill="#ccc090" opacity="0.5" />
          <rect x={x+1} y="2.5" width="54" height="3" rx="0.5" fill="#fffde7" opacity="0.95" />
          {/* Light glow on ceiling */}
          <rect x={x} y="6" width="56" height="5" fill="url(#lightGlow)" opacity="0.15" />
        </g>
      ))}

      {/* Wall main */}
      <rect x="0" y="11" width={VW} height="63" fill="#dce8f4" />

      {/* Wall upper accent stripe */}
      <rect x="0" y="11" width={VW} height="4" fill="#ccd8ea" />

      {/* Wainscoting */}
      <rect x="0" y="58" width={VW} height="9" fill="#c4d4e6" />
      <rect x="0" y="58" width={VW} height="1.5" fill="#b0c4d8" />
      <rect x="0" y="66" width={VW} height="1.5" fill="#b0c4d8" />

      {/* Baseboard */}
      <rect x="0" y="67" width={VW} height="7" fill="#7a90a4" />
      <rect x="0" y="67" width={VW} height="1" fill="#9ab0c0" />

      {/* ── Wall features ── */}

      {/* Door 1 */}
      <rect x="8"  y="13" width="26" height="55" rx="1" fill="#b4cde0" />
      <rect x="9"  y="14" width="24" height="53" rx="0.5" fill="#a4bcce" />
      <rect x="11" y="16" width="20" height="22" rx="0.5" fill="#c8dced" opacity="0.6" />
      <rect x="11" y="40" width="20" height="25" rx="0.5" fill="#c8dced" opacity="0.3" />
      <circle cx="31" cy="44" r="2.5" fill="#6080a0" />
      <rect x="19" y="11" width="8" height="3.5" rx="0.5" fill="#8090a0" />

      {/* ECG Monitor */}
      <rect x="78" y="14" width="40" height="26" rx="1.5" fill="#1a2a4a" />
      <rect x="79" y="15" width="38" height="24" rx="1" fill="#162040" />
      <polyline points="81,27 84,27 86,21 88,33 90,27 93,27 95,23 97,27 99,27 104,27 106,22 108,27 110,27 115,27" fill="none" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" />
      <text x="98" y="42" textAnchor="middle" fill="#60a5fa" fontSize="4" fontFamily="monospace">ECG MONITOR</text>

      {/* Patient chart */}
      <rect x="148" y="16" width="16" height="22" rx="0.5" fill="#fffde7" stroke="#d4b860" strokeWidth="0.5" />
      <rect x="154" y="13" width="4" height="5" rx="0.5" fill="#d4b860" />
      {[19,22,25,31,34].map(y => <line key={y} x1="150" y1={y} x2="162" y2={y} stroke="#bbb" strokeWidth="0.6" />)}
      <line x1="150" y1="28" x2="158" y2="28" stroke="#bbb" strokeWidth="0.6" />

      {/* Medical cross */}
      <rect x="180" y="14" width="5" height="16" rx="0.8" fill="#e74c3c" opacity="0.85" />
      <rect x="175" y="19" width="15" height="5" rx="0.8" fill="#e74c3c" opacity="0.85" />

      {/* Hospital signage */}
      <rect x="214" y="14" width="34" height="11" rx="1" fill="#1d4ed8" />
      <text x="231" y="21.5" textAnchor="middle" fill="white" fontSize="4.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.5">한양대학교병원</text>

      {/* Door 2 */}
      <rect x="267" y="13" width="26" height="55" rx="1" fill="#b4cde0" />
      <rect x="268" y="14" width="24" height="53" rx="0.5" fill="#a4bcce" />
      <rect x="270" y="16" width="20" height="22" rx="0.5" fill="#c8dced" opacity="0.6" />
      <rect x="270" y="40" width="20" height="25" rx="0.5" fill="#c8dced" opacity="0.3" />
      <circle cx="270" cy="44" r="2.5" fill="#6080a0" />
      <rect x="278" y="11" width="8" height="3.5" rx="0.5" fill="#8090a0" />

      {/* ── Floor ── */}
      <rect x="0" y={FLOOR_Y} width={VW} height={VH - FLOOR_Y} fill="#eaecee" />
      {/* Checkerboard tiles */}
      {Array.from({ length: 20 }, (_, i) =>
        <rect key={i} x={i * 16} y={FLOOR_Y} width={8} height={VH - FLOOR_Y} fill="#e0e2e4" />
      )}
      {/* Floor highlight (reflection) */}
      <rect x="0" y={FLOOR_Y} width={VW} height="2" fill="white" opacity="0.5" />
      {/* Floor shadow at baseboard */}
      <rect x="0" y={FLOOR_Y} width={VW} height="4" fill="#8090a0" opacity="0.2" />
    </>
  )
}

// ── XP particle ID counter ────────────────────────────────────────────────────
let _xpId = 0
const XP_SPOTS = [90, 110, 155, 185, 225, 230]  // near wall features

export default function InternPixelArt() {
  const [frame, setFrame] = useState(0)
  const [particles, setParticles] = useState([])
  const pid = useRef(0)

  // Walking frame toggle — 145ms ≈ fast walk cycle
  useEffect(() => {
    const iv = setInterval(() => setFrame(f => 1 - f), 145)
    return () => clearInterval(iv)
  }, [])

  // XP particles near wall features
  useEffect(() => {
    const iv = setInterval(() => {
      const id = ++pid.current
      const isTaein = id % 2 === 0
      const spot = XP_SPOTS[id % XP_SPOTS.length]
      const x = spot + (Math.random() * 14 - 7)
      setParticles(prev => [...prev.slice(-8), { id, x, isTaein }])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1100)
    }, 1100)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="pixel-scene-wrap">
      <svg
        width="100%"
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lightGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <CorridorBg />

        {/* Taein — walks left → right */}
        <g className="taein-corridor">
          <Sprite data={frame === 0 ? TAEIN_A : TAEIN_B} x={0} y={CHAR_Y} />
        </g>

        {/* Sojin — walks right → left (mirrored sprite) */}
        <g className="sojin-corridor">
          <Sprite data={frame === 0 ? SOJIN_A_L : SOJIN_B_L} x={0} y={CHAR_Y} />
        </g>

        {/* XP particles */}
        {particles.map(p => (
          <text
            key={p.id}
            x={p.x}
            y={CHAR_Y + 2}
            textAnchor="middle"
            fill={p.isTaein ? '#2563eb' : '#0891b2'}
            fontSize="7"
            fontWeight="800"
            fontFamily="monospace"
            className="xp-particle"
          >
            +XP
          </text>
        ))}
      </svg>
    </div>
  )
}
