const INTERN_TAEIN = {
  key: 'taein',
  name: '태인',
  role: '인턴',
  start: new Date(2026, 2, 1),   // 2026-03-01
  end:   new Date(2027, 1, 28),  // 2027-02-28
  next: null,
}

const INTERN_SOJIN = {
  key: 'sojin',
  name: '소진',
  role: '인턴',
  start: new Date(2025, 8, 1),   // 2025-09-01
  end:   new Date(2026, 7, 30),  // 2026-08-30
  next: {
    role: '영상의학과 레지던트 1년차',
    start: new Date(2026, 8, 1), // 2026-09-01
    avatar: '🔭',
  },
}

const INTERNS = [INTERN_TAEIN, INTERN_SOJIN]

const LEVELS = [
  { minPct: 0,  maxPct: 20,  lv: 1, avatar: '🩺', stage: '갓 입은 가운' },
  { minPct: 20, maxPct: 40,  lv: 2, avatar: '💊', stage: '약처방 익숙해짐' },
  { minPct: 40, maxPct: 60,  lv: 3, avatar: '🔬', stage: '중반 돌파' },
  { minPct: 60, maxPct: 80,  lv: 4, avatar: '⚕️',  stage: '나름 고참' },
  { minPct: 80, maxPct: 101, lv: 5, avatar: '🎓', stage: '수료 임박!' },
]

function getLevel(pct) {
  return LEVELS.find(l => pct >= l.minPct && pct < l.maxPct) || LEVELS[LEVELS.length - 1]
}

function formatDate(d) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function InternProgressCard({ intern }) {
  const today = new Date()
  const totalDays = Math.round((intern.end - intern.start) / 86400000)
  const elapsedDays = Math.max(0, Math.round((today - intern.start) / 86400000))
  const pct = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)))
  const remaining = Math.max(0, totalDays - elapsedDays)
  const lv = getLevel(pct)
  const isFinished = today > intern.end
  const isInNext = intern.next && today >= intern.next.start

  return (
    <div className="intern-progress-card">
      <div className={`intern-card-header ${intern.key}`}>
        <span className="intern-avatar">
          {isInNext ? intern.next.avatar : isFinished ? '🎉' : lv.avatar}
        </span>
        <div className="intern-info">
          <div className="intern-name-row">
            <span className="intern-name">{intern.name}</span>
            <span className={`intern-level-badge ${intern.key}`}>
              {isInNext ? 'R1' : isFinished ? 'DONE' : `LV.${lv.lv}`}
            </span>
          </div>
          <div className="intern-stage">
            {isInNext
              ? intern.next.role
              : isFinished
              ? '인턴 수료 완료 🎊'
              : lv.stage}
          </div>
        </div>
      </div>
      <div className="intern-card-body">
        <div className="intern-xp-label">
          <span className="intern-xp-title">
            {isInNext ? 'RESIDENT XP' : 'INTERN XP'}
          </span>
          <span className="intern-xp-pct">{isInNext ? '진행중' : `${pct}%`}</span>
        </div>
        <div className="intern-xp-bar-track">
          <div
            className={`intern-xp-bar-fill ${intern.key}`}
            style={{ width: isInNext ? '100%' : `${pct}%` }}
          />
        </div>
        {isInNext ? (
          <div className="intern-days-row">
            <span>
              인턴 수료 <span className="highlight">✓</span>
            </span>
            <span>
              레지던트 <span className="highlight">
                D+{Math.round((today - intern.next.start) / 86400000)}
              </span>
            </span>
          </div>
        ) : (
          <div className="intern-days-row">
            <span><span className="highlight">D+{elapsedDays}</span></span>
            <span>
              {isFinished
                ? <span style={{ color: `var(--${intern.key})` }}>수료!</span>
                : <><span className="highlight">{remaining}일</span> 남음</>
              }
            </span>
          </div>
        )}
        <div className="intern-date-range">
          {isInNext
            ? `${formatDate(intern.next.start)} ~`
            : `${formatDate(intern.start)} → ${formatDate(intern.end)}`}
        </div>
      </div>
    </div>
  )
}

function InternProgress() {
  return (
    <div>
      <div className="sidebar-section-title">
        <span>⚕️</span> 성장 현황
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {INTERNS.map(intern => (
          <InternProgressCard key={intern.key} intern={intern} />
        ))}
      </div>
    </div>
  )
}

export default InternProgress
