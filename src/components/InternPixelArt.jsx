import { useState, useEffect, useRef } from 'react'

// Intern dates
const TAEIN_START = new Date(2026, 2, 1)
const TAEIN_END   = new Date(2027, 1, 28)
const SOJIN_START = new Date(2025, 8, 1)
const SOJIN_END   = new Date(2026, 7, 30)

function calcPct(start, end) {
  const today = new Date()
  const total = end - start
  const elapsed = today - start
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

// ─── Pixel palette ───────────────────────────────────────────────────────────
const _ = null
const KH = '#1a120b' // taein hair
const SH = '#6b3a2a' // sojin hair
const SK = '#f4c195' // skin
const EY = '#2d1b0e' // eyes
const MO = '#c0392b' // mouth
const WC = '#f0f4ff' // white coat
const CS = '#c8d4e8' // coat shadow
const TB = '#2563eb' // taein blue trim
const ST = '#0891b2' // sojin teal trim
const TP = '#374151' // taein pants
const SQ = '#0e7490' // sojin skirt/pants
const SH2= '#1a1a2e' // shoes
const SC = '#64d4a8' // stethoscope (sojin)

// ─── Sprites (8 × 12 pixels each) ───────────────────────────────────────────
const TAEIN_SPRITE = [
  [_,  _,  KH, KH, KH, KH, _,  _ ],
  [_,  KH, KH, KH, KH, KH, KH, _ ],
  [_,  SK, SK, SK, SK, SK, SK, _ ],
  [_,  SK, EY, SK, SK, EY, SK, _ ],
  [_,  SK, SK, MO, MO, SK, SK, _ ],
  [WC, WC, WC, SK, SK, WC, WC, WC],
  [TB, WC, WC, WC, WC, WC, WC, _ ],
  [TB, WC, CS, CS, CS, WC, WC, _ ],
  [TB, WC, WC, WC, WC, WC, WC, _ ],
  [_,  TP, TP, TP, TP, TP, _,  _ ],
  [_,  TP, _,  _,  _,  TP, _,  _ ],
  [_,  SH2,_,  _,  _,  SH2,_,  _ ],
]

const SOJIN_SPRITE = [
  [_,  _,  SH, SH, SH, SH, _,  _ ],
  [_,  SH, SH, SH, SH, SH, SH, _ ],
  [_,  SK, SK, SK, SK, SK, SK, _ ],
  [_,  SK, EY, SK, SK, EY, SK, _ ],
  [_,  SK, SK, MO, SK, SK, SK, _ ],
  [WC, WC, WC, SK, SK, WC, WC, WC],
  [ST, WC, WC, WC, WC, WC, WC, _ ],
  [ST, WC, CS, CS, CS, WC, WC, _ ],
  [ST, WC, WC, WC, WC, WC, WC, _ ],
  [_,  SQ, SQ, SQ, SQ, SQ, _,  _ ],
  [_,  SK, _,  _,  _,  SK, _,  _ ],
  [_,  SH2,_,  _,  _,  SH2,_,  _ ],
]

const SCALE = 3

// ─── Sprite renderer ─────────────────────────────────────────────────────────
function Sprite({ data, x, y }) {
  const rects = []
  for (let ri = 0; ri < data.length; ri++) {
    for (let ci = 0; ci < data[ri].length; ci++) {
      const color = data[ri][ci]
      if (color) {
        rects.push(
          <rect
            key={`${ri}-${ci}`}
            x={x + ci * SCALE}
            y={y + ri * SCALE}
            width={SCALE}
            height={SCALE}
            fill={color}
            shapeRendering="crispEdges"
          />
        )
      }
    }
  }
  return <>{rects}</>
}

// ─── XP particle counter ─────────────────────────────────────────────────────
let _pid = 0

export default function InternPixelArt() {
  const taeinPct = calcPct(TAEIN_START, TAEIN_END)
  const sojinPct = calcPct(SOJIN_START, SOJIN_END)
  const [particles, setParticles] = useState([])
  const counter = useRef(0)

  useEffect(() => {
    const iv = setInterval(() => {
      const id = ++_pid
      const isTaein = counter.current % 2 === 0
      counter.current++
      const cx = isTaein ? 34 : 120   // center x of each char
      setParticles(prev => [...prev.slice(-6), { id, cx, isTaein }])
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 1600)
    }, 1800)
    return () => clearInterval(iv)
  }, [])

  // Character sprite origins
  const TX = 20, TY = 17   // Taein x, y
  const SX = 108, SY = 17  // Sojin x, y

  return (
    <div className="pixel-scene-wrap">
      <div className="pixel-scene-inner">
        <svg
          width="100%"
          viewBox="0 0 180 75"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          {/* === Wall === */}
          <rect x="0" y="0" width="180" height="56" fill="#dde8f4" />
          {/* Wall grid lines */}
          {[0, 36, 72, 108, 144, 180].map(x => (
            <line key={`wv${x}`} x1={x} y1="0" x2={x} y2="56"
              stroke="#ccd8ea" strokeWidth="0.4" />
          ))}
          {[0, 18, 36, 54].map(y => (
            <line key={`wh${y}`} x1="0" y1={y} x2="180" y2={y}
              stroke="#ccd8ea" strokeWidth="0.4" />
          ))}

          {/* ECG line on wall */}
          <polyline
            points="65,10 70,10 72,5 74,15 76,10 81,10"
            fill="none" stroke="#34d399" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round"
            opacity="0.8"
          />
          <circle cx="81" cy="10" r="1.2" fill="#34d399" opacity="0.8" />

          {/* Medical cross on wall (center) */}
          <rect x="88" y="5" width="4" height="12" rx="0.8" fill="#e74c3c" opacity="0.65" />
          <rect x="84" y="9" width="12" height="4" rx="0.8" fill="#e74c3c" opacity="0.65" />

          {/* === Floor === */}
          <rect x="0" y="56" width="180" height="19" fill="#edf0f3" />
          {[36, 72, 108, 144].map(x => (
            <line key={`fv${x}`} x1={x} y1="56" x2={x} y2="75"
              stroke="#d6dbe1" strokeWidth="0.4" />
          ))}
          <line x1="0" y1="65" x2="180" y2="65" stroke="#d6dbe1" strokeWidth="0.4" />
          {/* Wall-floor shadow */}
          <rect x="0" y="54" width="180" height="3" fill="#b0bfcf" opacity="0.35" />

          {/* === Desk === */}
          <rect x="56" y="40" width="68" height="6" rx="1" fill="#c8a26a" />
          <rect x="60" y="46" width="4" height="11" fill="#b8925a" />
          <rect x="116" y="46" width="4" height="11" fill="#b8925a" />
          {/* Monitor on desk */}
          <rect x="78" y="29" width="24" height="12" rx="1" fill="#1e3a8a" />
          <rect x="79" y="30" width="22" height="10" fill="#1d4ed8" />
          {/* Screen content lines */}
          <line x1="80" y1="32" x2="100" y2="32" stroke="#93c5fd" strokeWidth="0.6" />
          <line x1="80" y1="34" x2="96" y2="34" stroke="#93c5fd" strokeWidth="0.6" />
          <line x1="80" y1="36" x2="98" y2="36" stroke="#93c5fd" strokeWidth="0.6" />
          <line x1="80" y1="38" x2="94" y2="38" stroke="#93c5fd" strokeWidth="0.6" />
          {/* Monitor stand */}
          <rect x="87" y="41" width="6" height="2" fill="#4a5568" />

          {/* Clipboard next to Taein */}
          <rect x="46" y="24" width="9" height="13" rx="0.5"
            fill="#fefce8" stroke="#d97706" strokeWidth="0.5" />
          <rect x="49" y="22" width="3" height="3" rx="0.5" fill="#d97706" />
          <line x1="47.5" y1="28" x2="54" y2="28" stroke="#9a3412" strokeWidth="0.6" />
          <line x1="47.5" y1="30.5" x2="54" y2="30.5" stroke="#9a3412" strokeWidth="0.6" />
          <line x1="47.5" y1="33" x2="54" y2="33" stroke="#9a3412" strokeWidth="0.6" />

          {/* Stethoscope on Sojin */}
          <path
            d={`M${SX + 6},${SY + 17} Q${SX + 2},${SY + 22} ${SX + 6},${SY + 25}`}
            fill="none" stroke={SC} strokeWidth="1.2" strokeLinecap="round"
          />
          <circle cx={SX + 6} cy={SY + 25} r="2" fill={SC} />

          {/* === Characters === */}
          <g className="pixel-char-1">
            <Sprite data={TAEIN_SPRITE} x={TX} y={TY} />
          </g>
          <g className="pixel-char-2">
            <Sprite data={SOJIN_SPRITE} x={SX} y={SY} />
          </g>

          {/* === XP Particles === */}
          {particles.map(p => (
            <text
              key={p.id}
              x={p.cx}
              y="14"
              textAnchor="middle"
              fill={p.isTaein ? '#2563eb' : '#0891b2'}
              fontSize="6"
              fontWeight="800"
              fontFamily="monospace"
              className="xp-particle"
            >
              +XP
            </text>
          ))}
        </svg>
      </div>

      {/* XP bars */}
      <div className="pixel-xp-bars">
        <div className="pixel-xp-row">
          <span className="pixel-xp-name" style={{ color: '#1e40af' }}>태인</span>
          <div className="pixel-bar-track">
            <div className="pixel-bar-fill taein" style={{ width: `${taeinPct}%` }} />
          </div>
          <span className="pixel-xp-val">{taeinPct}%</span>
        </div>
        <div className="pixel-xp-row">
          <span className="pixel-xp-name" style={{ color: '#0e7490' }}>소진</span>
          <div className="pixel-bar-track">
            <div className="pixel-bar-fill sojin" style={{ width: `${sojinPct}%` }} />
          </div>
          <span className="pixel-xp-val">{sojinPct}%</span>
        </div>
      </div>
    </div>
  )
}
