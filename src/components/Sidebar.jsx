import InternProgress from './InternProgress'
import InternPixelArt from './InternPixelArt'

function Sidebar({ events, currentDate }) {
  return (
    <aside className="sidebar">
      <InternProgress />
      <div>
        <div className="sidebar-section-title"><span>🏥</span> 한양대학교병원</div>
        <div className="pixel-scene-wrap">
          <InternPixelArt />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
