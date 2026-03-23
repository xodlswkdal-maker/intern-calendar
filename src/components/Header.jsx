function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-cat">🐱</span>
        <div className="header-content">
          <h1 className="header-title">태인 &amp; 소진의 당직표</h1>
          <span className="header-period">2025.03 ~ 2026.02 🐾</span>
        </div>
      </div>
      <div className="header-legend">
        <span className="legend-item legend-day">데이</span>
        <span className="legend-item legend-duty">당직</span>
        <span className="legend-item legend-off">오프</span>
        <span className="legend-item legend-important">중요</span>
        <span className="legend-item legend-etc">기타</span>
        <span className="legend-item legend-meet">💕 만나는날</span>
      </div>
    </header>
  )
}

export default Header
