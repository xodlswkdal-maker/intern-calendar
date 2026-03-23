import { useState } from 'react'

const EVENT_TYPES = [
  { value: 'day', label: '데이' },
  { value: 'duty', label: '당직' },
  { value: 'off', label: '오프' },
  { value: 'dispatch', label: '파견' },
  { value: 'etc', label: '기타' },
]

const PERSONS = [
  { value: 'taein', label: '🙋‍♂️ 태인' },
  { value: 'sojin', label: '🙋‍♀️ 소진' },
]

function EventModal({ selectedDate, editingEvent, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(editingEvent?.title || '')
  const [type, setType] = useState(editingEvent?.type || 'day')
  const [person, setPerson] = useState(editingEvent?.person || 'taein')
  const [note, setNote] = useState(editingEvent?.note || '')
  const [date, setDate] = useState(editingEvent?.date || selectedDate || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      id: editingEvent?.id || Date.now().toString(),
      title: title.trim(),
      type,
      person,
      note: note.trim(),
      date,
    })
  }

  const handleDelete = () => {
    if (editingEvent && window.confirm('이 일정을 삭제할까요?')) {
      onDelete(editingEvent.id, editingEvent.date)
    }
  }

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
      })
    : ''

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingEvent ? '일정 수정' : '일정 추가'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="닫기">&times;</button>
        </div>

        {formattedDate && <p className="modal-date">{formattedDate}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>누구 일정?</label>
            <div className="person-buttons">
              {PERSONS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={`person-btn ${p.value} ${person === p.value ? 'active' : ''}`}
                  onClick={() => setPerson(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>구분</label>
            <div className="type-buttons">
              {EVENT_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`type-btn type-${t.value} ${type === t.value ? 'active' : ''}`}
                  onClick={() => setType(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">제목 *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="일정 제목 입력"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">메모</label>
            <textarea
              id="note"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="추가 메모 (선택사항)"
              rows={2}
            />
          </div>

          <div className="modal-actions">
            {editingEvent && (
              <button type="button" className="btn-delete" onClick={handleDelete}>
                삭제
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
              <button type="submit" className="btn-save">저장</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
