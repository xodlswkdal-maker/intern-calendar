import InternProgress from './InternProgress'
import InternPixelArt from './InternPixelArt'

function Sidebar({ events, currentDate }) {
  return (
    <aside className="sidebar">
      <InternProgress />
      <InternPixelArt />
    </aside>
  )
}

export default Sidebar
