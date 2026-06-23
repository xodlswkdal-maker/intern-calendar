function Header({ view, onViewChange }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-cross">
          {/* Hanyang University Hospital cross */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="2" width="6" height="20" rx="1.5" fill="#1d4ed8"/>
            <rect x="2" y="9" width="20" height="6" rx="1.5" fill="#1d4ed8"/>
          </svg>
        </div>
        <div className="header-content">
          <h1 className="header-title">한양대학교병원 인턴 스케줄러</h1>
          <span className="header-subtitle">HANYANG UNIV. HOSPITAL · 2026.03 – 2027.02</span>
        </div>
      </div>

      <nav className="header-nav">
        <button
          className={`header-tab ${view === 'calendar' ? 'is-active' : ''}`}
          onClick={() => onViewChange('calendar')}
        >
          📅 인턴 스케줄
        </button>
        <button
          className={`header-tab ${view === 'clinic' ? 'is-active' : ''}`}
          onClick={() => onViewChange('clinic')}
        >
          🏥 외과 외래표
        </button>
      </nav>

      {view === 'calendar' ? (
        <div className="header-legend">
          <span className="legend-item legend-day">☀️ 데이</span>
          <span className="legend-item legend-duty">🌙 당직</span>
          <span className="legend-item legend-off">🏖️ 오프</span>
          <span className="legend-item legend-dispatch">🚗 파견</span>
          <span className="legend-item legend-todo">☑️ 할일</span>
          <span className="legend-item legend-etc">📌 기타</span>
          <span className="legend-item legend-meet">✦ 겹치는날</span>
        </div>
      ) : (
        <div className="header-legend">
          <span className="legend-item legend-day">오전</span>
          <span className="legend-item legend-duty">오후</span>
        </div>
      )}
    </header>
  )
}

export default Header
