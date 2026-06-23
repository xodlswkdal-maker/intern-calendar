import { useState, useMemo } from 'react'

const STORAGE_KEY = 'hyu-surgery-clinic'

// 외래 요일 (월~토)
const DAYS = ['월', '화', '수', '목', '금', '토']
const SESSIONS = [
  { key: 'am', label: '오전' },
  { key: 'pm', label: '오후' },
]

// 한양대 외과 주요 분과 (이름은 마스킹된 예시)
const DIVISIONS = [
  '간담췌',
  '대장항문',
  '위장관',
  '유방내분비',
  '혈관',
  '이식',
  '소아외과',
  '외상',
]

// 클릭으로 데모를 빠르게 채우기 위한 예시 데이터 (실명 아님)
const SAMPLE = [
  { doctor: '김OO', division: '간담췌',   day: 0, session: 'am', room: '3진료실' },
  { doctor: '김OO', division: '간담췌',   day: 2, session: 'pm', room: '3진료실' },
  { doctor: '이OO', division: '대장항문', day: 1, session: 'am', room: '5진료실' },
  { doctor: '이OO', division: '대장항문', day: 3, session: 'am', room: '5진료실' },
  { doctor: '이OO', division: '대장항문', day: 4, session: 'pm', room: '5진료실' },
  { doctor: '박OO', division: '유방내분비', day: 0, session: 'pm', room: '7진료실' },
  { doctor: '박OO', division: '유방내분비', day: 3, session: 'am', room: '7진료실' },
  { doctor: '최OO', division: '위장관',   day: 1, session: 'pm', room: '2진료실' },
  { doctor: '최OO', division: '위장관',   day: 4, session: 'am', room: '2진료실' },
  { doctor: '정OO', division: '혈관',     day: 2, session: 'am', room: '6진료실' },
]

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function loadEntries() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

const emptyForm = { doctor: '', division: '', day: 0, session: 'am', room: '' }

function ClinicSchedule() {
  const [entries, setEntries] = useState(loadEntries)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [divFilter, setDivFilter] = useState('')

  const update = (next) => {
    setEntries(next)
    saveEntries(next)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const doctor = form.doctor.trim()
    if (!doctor) return
    // 같은 교수·요일·시간 중복 방지 (덮어쓰기)
    const filtered = entries.filter(
      (en) => !(en.doctor === doctor && en.day === Number(form.day) && en.session === form.session)
    )
    update([
      ...filtered,
      {
        id: makeId(),
        doctor,
        division: form.division.trim(),
        day: Number(form.day),
        session: form.session,
        room: form.room.trim(),
      },
    ])
    // 같은 교수님을 연속 입력하기 쉽도록 이름/분과는 유지
    setForm((f) => ({ ...f, room: '' }))
  }

  const removeSlot = (id) => update(entries.filter((en) => en.id !== id))

  const removeDoctor = (doctor) => {
    if (!window.confirm(`${doctor} 교수님의 외래를 모두 삭제할까요?`)) return
    update(entries.filter((en) => en.doctor !== doctor))
  }

  const loadSample = () => {
    if (entries.length && !window.confirm('현재 입력된 내용을 예시로 덮어쓸까요?')) return
    update(SAMPLE.map((s) => ({ ...s, id: makeId() })))
  }

  const clearAll = () => {
    if (!entries.length) return
    if (!window.confirm('외래표를 전부 비울까요?')) return
    update([])
  }

  // 교수님별로 묶어서 요약 만들기
  const doctors = useMemo(() => {
    const map = new Map()
    for (const en of entries) {
      if (!map.has(en.doctor)) {
        map.set(en.doctor, { doctor: en.doctor, division: en.division, slots: [] })
      }
      const d = map.get(en.doctor)
      d.slots.push(en)
      if (!d.division && en.division) d.division = en.division
    }

    let list = [...map.values()]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (d) =>
          d.doctor.toLowerCase().includes(q) ||
          (d.division || '').toLowerCase().includes(q)
      )
    }
    if (divFilter) {
      list = list.filter((d) => d.division === divFilter)
    }

    // 교수님 이름 가나다순
    list.sort((a, b) => a.doctor.localeCompare(b.doctor, 'ko'))
    return list
  }, [entries, search, divFilter])

  const usedDivisions = useMemo(
    () => [...new Set(entries.map((e) => e.division).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ko')),
    [entries]
  )

  const totalSlots = entries.length

  return (
    <div className="clinic">
      <div className="clinic-head">
        <div>
          <h2 className="clinic-title">외과 외래표 · 교수님별 요약</h2>
          <p className="clinic-sub">
            교수님 · 요일 · 오전/오후 · 진료실을 입력하면 한눈에 정리됩니다.
          </p>
        </div>
        <div className="clinic-stat">
          <span className="clinic-stat-num">{doctors.length}</span>
          <span className="clinic-stat-label">교수님</span>
          <span className="clinic-stat-num">{totalSlots}</span>
          <span className="clinic-stat-label">외래</span>
        </div>
      </div>

      {/* 입력 폼 */}
      <form className="clinic-form" onSubmit={handleAdd}>
        <div className="cf-field cf-doctor">
          <label>교수님</label>
          <input
            type="text"
            value={form.doctor}
            placeholder="예: 김OO"
            onChange={(e) => setForm({ ...form, doctor: e.target.value })}
          />
        </div>
        <div className="cf-field cf-div">
          <label>분과</label>
          <input
            type="text"
            list="division-list"
            value={form.division}
            placeholder="예: 간담췌"
            onChange={(e) => setForm({ ...form, division: e.target.value })}
          />
          <datalist id="division-list">
            {DIVISIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
        <div className="cf-field">
          <label>요일</label>
          <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
            {DAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="cf-field">
          <label>시간</label>
          <select value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })}>
            {SESSIONS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="cf-field cf-room">
          <label>진료실</label>
          <input
            type="text"
            value={form.room}
            placeholder="예: 3진료실"
            onChange={(e) => setForm({ ...form, room: e.target.value })}
          />
        </div>
        <button type="submit" className="cf-add">
          + 추가
        </button>
      </form>

      {/* 도구 모음 */}
      <div className="clinic-tools">
        <input
          className="clinic-search"
          type="text"
          value={search}
          placeholder="교수님/분과 검색"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={divFilter} onChange={(e) => setDivFilter(e.target.value)} className="clinic-divfilter">
          <option value="">전체 분과</option>
          {usedDivisions.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <div className="clinic-tools-spacer" />
        <button type="button" className="btn-ghost" onClick={loadSample}>
          예시 불러오기
        </button>
        <button type="button" className="btn-ghost btn-danger" onClick={clearAll}>
          전체 삭제
        </button>
      </div>

      {/* 교수님별 요약 카드 */}
      {doctors.length === 0 ? (
        <div className="clinic-empty">
          {totalSlots === 0
            ? '아직 입력된 외래가 없습니다. 위에서 추가하거나 "예시 불러오기"를 눌러보세요.'
            : '검색/필터 조건에 맞는 교수님이 없습니다.'}
        </div>
      ) : (
        <div className="clinic-cards">
          {doctors.map((d) => (
            <DoctorCard key={d.doctor} doctor={d} onRemoveSlot={removeSlot} onRemoveDoctor={removeDoctor} />
          ))}
        </div>
      )}
    </div>
  )
}

function DoctorCard({ doctor, onRemoveSlot, onRemoveDoctor }) {
  // day-session -> slot
  const cell = (day, session) =>
    doctor.slots.find((s) => s.day === day && s.session === session)

  return (
    <div className="doc-card">
      <div className="doc-head">
        <div className="doc-name-wrap">
          <span className="doc-name">{doctor.doctor}</span>
          {doctor.division && <span className="doc-div">{doctor.division}</span>}
        </div>
        <div className="doc-meta">
          <span className="doc-count">주 {doctor.slots.length}회</span>
          <button
            className="doc-remove"
            title="이 교수님 외래 전체 삭제"
            onClick={() => onRemoveDoctor(doctor.doctor)}
          >
            ×
          </button>
        </div>
      </div>

      <table className="doc-grid">
        <thead>
          <tr>
            <th className="doc-grid-corner" />
            {DAYS.map((d, i) => (
              <th key={d} className={i >= 5 ? 'doc-sat' : ''}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SESSIONS.map((s) => (
            <tr key={s.key}>
              <th className="doc-session">{s.label}</th>
              {DAYS.map((d, i) => {
                const slot = cell(i, s.key)
                return (
                  <td key={i} className={slot ? 'doc-on' : 'doc-off'}>
                    {slot ? (
                      <button
                        className="doc-slot"
                        title={`클릭하면 삭제 · ${DAYS[i]} ${s.label}${slot.room ? ' ' + slot.room : ''}`}
                        onClick={() => onRemoveSlot(slot.id)}
                      >
                        {slot.room || '○'}
                      </button>
                    ) : (
                      <span className="doc-dot">·</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClinicSchedule
