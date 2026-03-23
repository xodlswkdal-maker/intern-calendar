import { useReducer, useEffect } from 'react'

const INTERNS = [
  {
    key: 'taein',
    name: '태인',
    start: new Date(2026, 2, 1),
    end:   new Date(2027, 1, 28),
    next: null,
  },
  {
    key: 'sojin',
    name: '소진',
    start: new Date(2025, 8, 1),
    end:   new Date(2026, 7, 30),
    next: {
      role: '영상의학과 레지던트 1년차',
      start: new Date(2026, 8, 1),
      avatar: '🔭',
    },
  },
]

const LEVELS = [
  { max: 20,  lv: 1, avatar: '🩺', stage: '갓 입은 가운' },
  { max: 40,  lv: 2, avatar: '💊', stage: '약처방 익숙해짐' },
  { max: 60,  lv: 3, avatar: '🔬', stage: '중반 돌파' },
  { max: 80,  lv: 4, avatar: '⚕️',  stage: '나름 고참' },
  { max: 101, lv: 5, avatar: '🎓', stage: '수료 임박!' },
]

function getLevel(pct) {
  return LEVELS.find(l => pct < l.max) || LEVELS[LEVELS.length - 1]
}

function pad(n) { return String(n).padStart(2, '0') }

function calcProgress(start, end) {
  const now = new Date()
  const totalMs = end - start
  const elapsedMs = Math.max(0, now - start)
  const pct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100))

  const totalSec = Math.floor(elapsedMs / 1000)
  const d  = Math.floor(totalSec / 86400)
  const h  = Math.floor((totalSec % 86400) / 3600)
  const m  = Math.floor((totalSec % 3600) / 60)
  const s  = totalSec % 60
  const clock = `${pad(h)}:${pad(m)}:${pad(s)}`
  const remainDays = Math.max(0, Math.ceil((end - now) / 86400000))

  return { pct, d, clock, remainDays }
}

function InternCard({ intern }) {
  const today = new Date()
  const isInNext = intern.next && today >= intern.next.start
  const isFinished = !isInNext && today > intern.end

  const { pct, d, clock, remainDays } = isInNext
    ? calcProgress(intern.next.start, new Date(intern.next.start.getFullYear() + 1, intern.next.start.getMonth(), intern.next.start.getDate()))
    : calcProgress(intern.start, intern.end)

  const lv = getLevel(pct)

  const avatar = isInNext ? intern.next.avatar : isFinished ? '🎉' : lv.avatar
  const badge  = isInNext ? 'R1' : isFinished ? 'DONE' : `LV.${lv.lv}`
  const stage  = isInNext ? intern.next.role : isFinished ? '인턴 수료 완료' : lv.stage

  return (
    <div className="intern-progress-card">
      <div className={`intern-card-header ${intern.key}`}>
        <span className="intern-avatar">{avatar}</span>
        <div className="intern-info">
          <div className="intern-name-row">
            <span className="intern-name">{intern.name}</span>
            <span className={`intern-level-badge ${intern.key}`}>{badge}</span>
          </div>
          <div className="intern-stage">{stage}</div>
        </div>
      </div>
      <div className="intern-card-body">
        <div className="intern-xp-label">
          <span className="intern-xp-title">{isInNext ? 'RESIDENT XP' : 'INTERN XP'}</span>
          <span className="intern-xp-pct">{pct.toFixed(2)}%</span>
        </div>
        <div className="intern-xp-bar-track">
          <div
            className={`intern-xp-bar-fill ${intern.key}`}
            style={{ width: `${Math.min(100, pct)}%`, transition: 'width 0.1s linear' }}
          />
        </div>
        <div className="intern-days-row">
          <span>
            <span className="highlight">D+{d}</span>
            <span style={{ fontSize: '9px', marginLeft: '4px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {clock}
            </span>
          </span>
          <span>
            {isFinished
              ? <span style={{ color: `var(--${intern.key})` }}>수료!</span>
              : isInNext
              ? <><span className="highlight">{remainDays}일</span> 남음</>
              : <><span className="highlight">{remainDays}일</span> 남음</>
            }
          </span>
        </div>
      </div>
    </div>
  )
}

export default function InternProgress() {
  const [, tick] = useReducer(x => x + 1, 0)

  useEffect(() => {
    const iv = setInterval(tick, 100)
    return () => clearInterval(iv)
  }, [])

  return (
    <div>
      <div className="sidebar-section-title">
        <span>⚕️</span> 성장 현황
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {INTERNS.map(intern => (
          <InternCard key={intern.key} intern={intern} />
        ))}
      </div>
    </div>
  )
}
