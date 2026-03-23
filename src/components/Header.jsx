function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">인턴 일정표</h1>
        <span className="header-period">2025년 3월 ~ 2026년 2월</span>
      </div>
      <div className="header-legend">
        <span className="legend-item legend-duty">당직</span>
        <span className="legend-item legend-off">오프</span>
        <span className="legend-item legend-important">중요일정</span>
        <span className="legend-item legend-etc">기타</span>
      </div>
    </header>
  )
}

export default Header
