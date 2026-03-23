import InternProgress from './InternProgress'

function isMeetingDay(dayEvents) {
  const taeinTypes = dayEvents.filter(e => e.person === 'taein').map(e => e.type)
  const sojinTypes = dayEvents.filter(e => e.person === 'sojin').map(e => e.type)
  if (taeinTypes.length === 0 || sojinTypes.length === 0) return false
  return (taeinTypes.includes('off') && sojinTypes.includes('off')) ||
    (taeinTypes.includes('day') && sojinTypes.includes('day'))
}

function Sidebar({ events, currentDate }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  let overlapCount = 0
  Object.entries(events).forEach(([dateKey, dayEvents]) => {
    const [y, m] = dateKey.split('-').map(Number)
    if (y === year && m === month + 1 && isMeetingDay(dayEvents)) overlapCount++
  })

  return (
    <aside className="sidebar">
      <InternProgress />

      {/* 겹치는 날 */}
      <div className="overlap-row">
        <span className="overlap-icon">✦</span>
        <div className="overlap-text">
          <span className="overlap-count">{overlapCount}</span>
          <span className="overlap-label">겹치는 날</span>
        </div>
        <span className="overlap-sub">오프·데이 일치</span>
      </div>
    </aside>
  )
}

export default Sidebar
