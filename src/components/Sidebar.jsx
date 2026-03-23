const TYPE_LABEL = { day: '데이', duty: '당직', off: '오프', important: '중요', etc: '기타' }
const TYPE_KEYS = ['day', 'duty', 'off', 'important', 'etc']

function isMeetingDay(dayEvents) {
  const taeinTypes = dayEvents.filter(e => e.person === 'taein').map(e => e.type)
  const sojinTypes = dayEvents.filter(e => e.person === 'sojin').map(e => e.type)
  if (taeinTypes.length === 0 || sojinTypes.length === 0) return false
  return (taeinTypes.includes('off') && sojinTypes.includes('off')) ||
    (taeinTypes.includes('day') && sojinTypes.includes('day'))
}

function Sidebar({ events, currentDate, onEventClick }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthEvents = []
  let meetCount = 0

  Object.entries(events).forEach(([dateKey, dayEvents]) => {
    const [y, m] = dateKey.split('-').map(Number)
    if (y === year && m === month + 1) {
      dayEvents.forEach(ev => monthEvents.push({ ...ev, dateKey }))
      if (isMeetingDay(dayEvents)) meetCount++
    }
  })
  monthEvents.sort((a, b) => a.dateKey.localeCompare(b.dateKey))

  const taeinCounts = Object.fromEntries(TYPE_KEYS.map(k => [k, 0]))
  const sojinCounts = Object.fromEntries(TYPE_KEYS.map(k => [k, 0]))

  monthEvents.forEach(ev => {
    if (ev.person === 'taein' && taeinCounts[ev.type] !== undefined) taeinCounts[ev.type]++
    if (ev.person === 'sojin' && sojinCounts[ev.type] !== undefined) sojinCounts[ev.type]++
  })

  const formatDay = (dateKey) => {
    const [, , d] = dateKey.split('-')
    return `${parseInt(d)}일`
  }

  return (
    <aside className="sidebar">
      {/* 만나는날 카드 */}
      <div className="meet-card">
        <div className="meet-card-emoji">💕</div>
        <div className="meet-card-count">{meetCount}</div>
        <div className="meet-card-label">이번달 만나는날</div>
      </div>

      {/* 태인/소진 통계 */}
      <div>
        <div className="sidebar-section-title">🐾 이번달 현황</div>
        <div className="person-stats">
          {[
            { key: 'taein', label: '태인', counts: taeinCounts },
            { key: 'sojin', label: '소진', counts: sojinCounts },
          ].map(({ key, label, counts }) => (
            <div key={key} className={`person-stat-card ${key}`}>
              <div className="person-stat-name">
                <span className={`person-badge ${key}`}>{label[0]}</span>
                {label}
              </div>
              <div className="person-stat-counts">
                {TYPE_KEYS.map(type => counts[type] > 0 && (
                  <span key={type} className={`stat-chip ${type}`}>
                    {TYPE_LABEL[type]} {counts[type]}
                  </span>
                ))}
                {TYPE_KEYS.every(t => counts[t] === 0) && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>일정 없음</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 이번달 일정 목록 */}
      <div>
        <div className="sidebar-section-title">📅 이번달 일정</div>
        {monthEvents.length === 0 ? (
          <p className="no-events">등록된 일정이 없어요 🐱</p>
        ) : (
          <ul className="event-list">
            {monthEvents.map(ev => (
              <li
                key={ev.id}
                className="event-list-item"
                onClick={() => onEventClick(ev, ev.dateKey)}
              >
                <span className="event-list-day">{formatDay(ev.dateKey)}</span>
                <span className={`event-list-badge badge-${ev.type}`}>{TYPE_LABEL[ev.type]}</span>
                <span className="event-list-title">{ev.title}</span>
                {ev.person && (
                  <span className={`event-list-person ${ev.person}`}>
                    {ev.person === 'taein' ? '태' : '소'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
