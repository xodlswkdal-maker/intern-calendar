import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.addEventListener('error', (e) => {
  const root = document.getElementById('root')
  if (root && !root.hasChildNodes()) {
    root.innerHTML = '<pre style="padding:20px;color:#dc2626;font-family:monospace;font-size:11px;white-space:pre-wrap">JS ERROR: ' + e.message + '\n' + (e.error && e.error.stack || '') + '</pre>'
  }
})

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding:'40px 24px', fontFamily:'monospace', background:'#fff', minHeight:'100vh' }}>
          <h2 style={{ color:'#dc2626', marginBottom:16 }}>⚠️ 렌더링 오류</h2>
          <pre style={{ background:'#f1f5f9', padding:'16px', borderRadius:'8px', fontSize:'12px', whiteSpace:'pre-wrap', color:'#334155' }}>
            {String(this.state.error)}{'\n\n'}{this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
