const TYPE_LABEL = { duty: '당직', off: '오프', important: '중요일정', etc: '기타' }

function Sidebar({ events, currentDate, onEventClick }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 이번 달 일정 수집
  const monthEvents = []
  Object.entries(events).forEach(([dateKey, dayEvents]) => {
    const [y, m] = dateKey.split('-').map(Number)
    if (y === year && m === month + 1) {
      dayEvents.forEach(ev => monthEvents.push({ ...ev, dateKey }))
    }
  })
  monthEvents.sort((a, b) => a.dateKey.localeCompare(b.dateKey))

  // 타입별 카운트
  const counts = { duty: 0, off: 0, important: 0, etc: 0 }
  monthEvents.forEach(ev => { if (counts[ev.type] !== undefined) counts[ev.type]++ })

  const formatDay = (dateKey) => {
    const [, , d] = dateKey.split('-')
    return `${parseInt(d)}일`
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-summary">
        <h3>이번 달 현황</h3>
        <div className="summary-grid">
          {Object.entries(counts).map(([type, count]) => (
            <div key={type} className={`summary-item summary-${type}`}>
              <span className="summary-count">{count}</span>
              <span className="summary-label">{TYPE_LABEL[type]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-events">
        <h3>이번 달 일정</h3>
        {monthEvents.length === 0 ? (
          <p className="no-events">등록된 일정이 없습니다.</p>
        ) : (
          <ul className="event-list">
            {monthEvents.map(ev => (
              <li
                key={ev.id}
                className={`event-list-item event-${ev.type}`}
                onClick={() => onEventClick(ev, ev.dateKey)}
              >
                <span className="event-list-day">{formatDay(ev.dateKey)}</span>
                <span className={`event-list-badge badge-${ev.type}`}>{TYPE_LABEL[ev.type]}</span>
                <span className="event-list-title">{ev.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
