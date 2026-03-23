import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EventModal from './components/EventModal'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import './App.css'

const STORAGE_KEY = 'intern-calendar-events'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)) // 2025년 3월 시작
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const MIN_DATE = new Date(2025, 2, 1)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const handleDayClick = (date) => {
    setSelectedDate(date)
    setEditingEvent(null)
    setModalOpen(true)
  }

  const handleEventClick = (event, date) => {
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

  const canGoPrev = !(currentDate.getFullYear() === 2025 && currentDate.getMonth() === 2)
  const canGoNext = !(currentDate.getFullYear() === 2026 && currentDate.getMonth() === 1)

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
