const DAYS = ['일', '월', '화', '수', '목', '금', '토']

const TYPE_LABEL = { day: '데이', duty: '당직', off: '오프', dispatch: '파견', todo: '할일', etc: '기타' }
const TYPE_ICON  = { day: '☀️', duty: '🌙', off: '🏖️', dispatch: '🚗', todo: '☑️', etc: '📌' }
const EVENT_TYPES = ['day', 'duty', 'off', 'dispatch', 'todo', 'etc']

const PERSONS = [
  { value: 'taein', label: '태인' },
  { value: 'sojin', label: '소진' },
]

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isMeetingDay(dayEvents) {
  const taeinTypes = dayEvents.filter(e => e.person === 'taein').map(e => e.type)
  const sojinTypes = dayEvents.filter(e => e.person === 'sojin').map(e => e.type)
  if (taeinTypes.length === 0 || sojinTypes.length === 0) return false
  return (taeinTypes.includes('off') && sojinTypes.includes('off')) ||
    (taeinTypes.includes('day') && sojinTypes.includes('day'))
}

function Calendar({ currentDate, events, onDayClick, onEventClick, onPrevMonth, onNextMonth, canGoPrev, canGoNext, quickMode, onQuickModeChange }) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const monthName = `${year}년 ${month + 1}월`

  // month totals for stat bar
  const monthTotals = { day: 0, duty: 0, off: 0, dispatch: 0, todo: 0, etc: 0 }
  Object.entries(events).forEach(([key, dayEvs]) => {
    const [y, m] = key.split('-').map(Number)
    if (y === year && m === month + 1) {
      dayEvs.forEach(e => { if (monthTotals[e.type] !== undefined) monthTotals[e.type]++ })
    }
  })
  const hasMonthEvents = Object.values(monthTotals).some(v => v > 0)

  const toggleQuick = () => {
    onQuickModeChange(prev => ({ ...prev, active: !prev.active }))
  }

  return (
    <div className="calendar">
      <div className="calendar-nav">
        <button className="nav-btn" onClick={onPrevMonth} disabled={!canGoPrev} aria-label="이전 달">
          &#8249;
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <h2 className="calendar-month">{monthName}</h2>
          {hasMonthEvents && (
            <div className="calendar-month-stats">
              {EVENT_TYPES.filter(t => monthTotals[t] > 0).map(t => (
                <span key={t} className={`month-mini-chip chip-${t}`}>
                  {TYPE_ICON[t]} {monthTotals[t]}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={`quick-toggle-btn ${quickMode.active ? 'active' : ''}`}
            onClick={toggleQuick}
            title="빠른 입력 모드"
          >
            {quickMode.active ? '✅ 입력중' : '⚡ 빠른입력'}
          </button>
          <button className="nav-btn" onClick={onNextMonth} disabled={!canGoNext} aria-label="다음 달">
            &#8250;
          </button>
        </div>
      </div>

      {quickMode.active && (
        <div className="quick-bar">
          <div className="quick-bar-hint">날짜를 탭하면 바로 추가 · 다시 탭하면 취소</div>
          <div className="quick-bar-controls">
            <div className="quick-group">
              {PERSONS.map(p => (
                <button
                  key={p.value}
                  className={`quick-person-btn ${p.value} ${quickMode.person === p.value ? 'active' : ''}`}
                  onClick={() => onQuickModeChange(prev => ({ ...prev, person: p.value }))}
                >
                  <span className={`chip-person ${p.value}`}>{p.value === 'taein' ? '태' : '소'}</span>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="quick-divider" />
            <div className="quick-group">
              {EVENT_TYPES.map(t => (
                <button
                  key={t}
                  className={`quick-type-btn type-${t} ${quickMode.type === t ? 'active' : ''}`}
                  onClick={() => onQuickModeChange(prev => ({ ...prev, type: t }))}
                >
                  {TYPE_ICON[t]} {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
            <div className="quick-divider" />
            <input
              className="quick-title-input"
              type="text"
              placeholder={TYPE_LABEL[quickMode.type]}
              value={quickMode.title}
              onChange={e => onQuickModeChange(prev => ({ ...prev, title: e.target.value }))}
            />
            <button className="quick-done-btn" onClick={toggleQuick}>완료</button>
          </div>
        </div>
      )}

      <div className={`calendar-grid ${quickMode.active ? 'quick-mode' : ''}`}>
        {DAYS.map((d, i) => (
          <div key={d} className={`day-header ${i === 0 ? 'sunday' : i === 6 ? 'saturday' : ''}`}>
            {d}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="day-cell empty" />

          const dateKey = toDateKey(year, month, day)
          const dayEvents = events[dateKey] || []
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
          const dayOfWeek = (firstDay + day - 1) % 7
          const isSunday = dayOfWeek === 0
          const isSaturday = dayOfWeek === 6
          const canMeet = isMeetingDay(dayEvents)

          const hasQuickEvent = quickMode.active &&
            dayEvents.some(e => e.person === quickMode.person && e.type === quickMode.type)

          // todos separate, shown first; rest sorted by person
          const todos = dayEvents.filter(e => e.type === 'todo')
          const shifts = dayEvents.filter(e => e.type !== 'todo')
          const sorted = [...todos, ...shifts]

          return (
            <div
              key={dateKey}
              className={[
                'day-cell',
                isToday ? 'today' : '',
                isSunday ? 'sunday' : '',
                isSaturday ? 'saturday' : '',
                canMeet ? 'meet-day' : '',
                hasQuickEvent ? 'quick-selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onDayClick(dateKey)}
            >
              {canMeet && <span className="meet-indicator">✦</span>}
              <span className="day-number">{day}</span>
              <div className="day-events">
                {sorted.slice(0, 4).map(event => (
                  <div
                    key={event.id}
                    className={`event-chip event-${event.type}`}
                    onClick={e => { e.stopPropagation(); onEventClick(event, dateKey) }}
                    title={`${event.person === 'taein' ? '태인' : '소진'} ${event.title}`}
                  >
                    <span className="chip-type-icon">{TYPE_ICON[event.type]}</span>
                    {event.person && (
                      <span className={`chip-person ${event.person}`}>
                        {event.person === 'taein' ? '태' : '소'}
                      </span>
                    )}
                    <span className="chip-title">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 4 && (
                  <div className="event-more">+{dayEvents.length - 4}개 더</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
