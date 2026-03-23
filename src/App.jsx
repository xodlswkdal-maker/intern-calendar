import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EventModal from './components/EventModal'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import './App.css'

const STORAGE_KEY = 'intern-calendar-events'
const TYPE_LABEL = { day: '데이', duty: '당직', off: '오프', dispatch: '파견', important: '중요', etc: '기타' }

function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1))
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [quickMode, setQuickMode] = useState({ active: false, person: 'taein', type: 'day', title: '' })

  const MIN_DATE = new Date(2026, 2, 1)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const handleDayClick = (dateKey) => {
    if (quickMode.active) {
      const { person, type, title } = quickMode
      const eventTitle = title.trim() || TYPE_LABEL[type]
      setEvents(prev => {
        const dayEvents = prev[dateKey] ? [...prev[dateKey]] : []
        const existingIdx = dayEvents.findIndex(e => e.person === person && e.type === type)
        if (existingIdx !== -1) {
          const filtered = dayEvents.filter((_, i) => i !== existingIdx)
          const next = { ...prev }
          if (filtered.length === 0) delete next[dateKey]
          else next[dateKey] = filtered
          return next
        }
        return {
          ...prev,
          [dateKey]: [...dayEvents, {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            title: eventTitle,
            type,
            person,
            note: '',
            date: dateKey,
          }],
        }
      })
      return
    }
    setSelectedDate(dateKey)
    setEditingEvent(null)
    setModalOpen(true)
  }

  const handleEventClick = (event, date) => {
    if (quickMode.active) return
    setSelectedDate(date)
    setEditingEvent(event)
    setModalOpen(true)
  }

  const handleSaveEvent = (eventData) => {
    const dateKey = eventData.date
    setEvents(prev => {
      const dayEvents = prev[dateKey] ? [...prev[dateKey]] : []
      if (editingEvent) {
        const idx = dayEvents.findIndex(e => e.id === editingEvent.id)
        if (idx !== -1) dayEvents[idx] = eventData
      } else {
        dayEvents.push(eventData)
      }
      return { ...prev, [dateKey]: dayEvents }
    })
    setModalOpen(false)
  }

  const handleDeleteEvent = (eventId, dateKey) => {
    setEvents(prev => {
      const dayEvents = (prev[dateKey] || []).filter(e => e.id !== eventId)
      const next = { ...prev }
      if (dayEvents.length === 0) delete next[dateKey]
      else next[dateKey] = dayEvents
      return next
    })
    setModalOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const d = new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
      return d < MIN_DATE ? MIN_DATE : d
    })
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const canGoPrev = !(currentDate.getFullYear() === 2026 && currentDate.getMonth() === 2)
  const canGoNext = !(currentDate.getFullYear() === 2027 && currentDate.getMonth() === 1)

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar events={events} currentDate={currentDate} onEventClick={handleEventClick} />
        <main className="main-content">
          <Calendar
            currentDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            quickMode={quickMode}
            onQuickModeChange={setQuickMode}
          />
        </main>
      </div>
      {modalOpen && (
        <EventModal
          selectedDate={selectedDate}
          editingEvent={editingEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

export default App
