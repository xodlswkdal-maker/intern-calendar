import { useState } from 'react'
import InternProgress from './InternProgress'
import InternPixelArt from './InternPixelArt'

const TYPE_LABEL = { day: '데이', duty: '당직', off: '오프', dispatch: '파견', todo: '할일', etc: '기타' }
const TYPE_ICON  = { day: '☀️', duty: '🌙', off: '🏖️', dispatch: '🚗', todo: '☑️', etc: '📌' }
const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']

function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getUpcomingDays(events, days = 14) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const result = []
  for (let i = 0; i < days; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const key = toDateKey(d)
    const dayEvs = events[key] || []
    result.push({ dateKey: key, date: d, events: dayEvs, isToday: i === 0 })
  }
  return result.filter(r => r.isToday || r.events.length > 0)
}

function getMonthStats(events, year, month) {
  const stats = { day: 0, duty: 0, off: 0, dispatch: 0, todo: 0, etc: 0 }
  Object.entries(events).forEach(([key, dayEvs]) => {
    const [y, m] = key.split('-').map(Number)
    if (y === year && m === month + 1) {
      dayEvs.forEach(e => { if (stats[e.type] !== undefined) stats[e.type]++ })
    }
  })
  return stats
}

function Sidebar({ events, currentDate, onEventClick }) {
  const [showPixelArt, setShowPixelArt] = useState(false)
  const upcoming = getUpcomingDays(events)
  const monthStats = getMonthStats(events, currentDate.getFullYear(), currentDate.getMonth())
  const totalMonthEvents = Object.values(monthStats).reduce((s, v) => s + v, 0)

  return (
    <aside className="sidebar">

      {/* ── 다가오는 일정 ── */}
      <div>
        <div className="sidebar-section-title"><span>📅</span> 다가오는 일정</div>
        <div className="upcoming-list">
          {upcoming.length === 0 && (
            <div className="no-events">앞으로 2주간 일정 없음</div>
          )}
          {upcoming.map(({ dateKey, date, events: dayEvs, isToday }) => (
            <div key={dateKey} className={`upcoming-day ${isToday ? 'upcoming-today' : ''}`}>
              <div className="upcoming-date-col">
                <span className="upcoming-day-num">{date.getDate()}</span>
                <span className="upcoming-day-of-week">{DAYS_KO[date.getDay()]}</span>
                {isToday && <span className="upcoming-today-badge">오늘</span>}
              </div>
              <div className="upcoming-events-col">
                {dayEvs.length === 0 ? (
                  <span className="upcoming-no-event">일정 없음</span>
                ) : (
                  dayEvs.map(ev => (
                    <div
                      key={ev.id}
                      className={`upcoming-event-row type-${ev.type}`}
                      onClick={() => onEventClick(ev, dateKey)}
                    >
                      <span className="upcoming-type-icon">{TYPE_ICON[ev.type] || '•'}</span>
                      <span className={`chip-person ${ev.person}`}>
                        {ev.person === 'taein' ? '태' : '소'}
                      </span>
                      <span className="upcoming-event-title">{ev.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 이번 달 통계 ── */}
      {totalMonthEvents > 0 && (
        <div>
          <div className="sidebar-section-title">
            <span>📊</span> {currentDate.getMonth()+1}월 통계
          </div>
          <div className="month-stat-grid">
            {Object.entries(monthStats).filter(([, v]) => v > 0).map(([type, count]) => (
              <div key={type} className={`month-stat-item stat-${type}`}>
                <span className="month-stat-icon">{TYPE_ICON[type]}</span>
                <span className="month-stat-count">{count}</span>
                <span className="month-stat-label">{TYPE_LABEL[type]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 인턴 성장 현황 ── */}
      <InternProgress />

      {/* ── 병원 픽셀아트 (접기/펼치기) ── */}
      <div>
        <div
          className="sidebar-section-title sidebar-collapsible"
          onClick={() => setShowPixelArt(v => !v)}
        >
          <span>🏥</span> 한양대학교병원
          <span className="collapse-arrow">{showPixelArt ? '▲' : '▼'}</span>
        </div>
        {showPixelArt && (
          <div className="pixel-scene-wrap">
            <InternPixelArt />
          </div>
        )}
      </div>

    </aside>
  )
}

export default Sidebar
