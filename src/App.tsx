import { useEffect, useLayoutEffect, useState } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import type { PrismeConfig, PrismeContext } from './types/config'
import { WidgetGrid } from './components/WidgetGrid'
import { filterWidgetsByContext } from './utils/filterWidgets'
import './App.css'

type DashboardMode = 'static' | 'dynamic' | 'focus'

function DashboardView() {
  const { mode } = useParams<{ mode: string }>()
  const dashboardMode: DashboardMode =
    mode === 'static' || mode === 'dynamic' || mode === 'focus' ? mode : 'static'

  const titleByMode: Record<DashboardMode, string> = {
    static: 'Static dashboard',
    dynamic: 'Dynamic dashboard',
    focus: 'Focus',
  }
  useLayoutEffect(() => {
    const title = titleByMode[dashboardMode]
    document.title = title ? `Prisme — ${title}` : 'Prisme'
    return () => {
      document.title = 'Prisme'
    }
  }, [dashboardMode])

  const [config, setConfig] = useState<PrismeConfig | null>(null)
  const [context, setContext] = useState<PrismeContext | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/config.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setConfig)
      .catch((err) => setError(err.message))
  }, [])

  const fetchContext = () =>
    fetch('/context.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setContext(data && Array.isArray(data.tags) ? data : null))
      .catch(() => setContext(null))

  useEffect(() => {
    if (dashboardMode !== 'dynamic') return
    fetchContext()
    const intervalSeconds = config?.display_config?.context_poll_interval_seconds ?? 5
    const intervalMs = Math.max(2000, intervalSeconds * 1000)
    const id = setInterval(fetchContext, intervalMs)
    return () => clearInterval(id)
  }, [dashboardMode, config?.display_config?.context_poll_interval_seconds])

  if (error) {
    return (
      <div className="app app--error">
        <h1>Prisme</h1>
        <p>Failed to load configuration: {error}</p>
        <p>Create <code>data/config.json</code> from <code>docs/config.json.example</code> (see <code>data/README.md</code>).</p>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="app app--loading">
        <h1>Prisme</h1>
        <p>Loading…</p>
      </div>
    )
  }

  const labels = titleByMode

  let widgets = config.widgets
  if (dashboardMode === 'dynamic') {
    if (context === undefined) {
      return (
        <div className="app app--loading">
          <h1>Prisme</h1>
          <p>Loading context…</p>
        </div>
      )
    }
    if (context === null) {
      widgets = []
    } else {
      widgets = filterWidgetsByContext(config.widgets, context.tags)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Prisme</h1>
        <span className="app-header__sub">{labels[dashboardMode]}</span>
      </header>
      <main className="app-main">
        {dashboardMode === 'dynamic' && context === null ? (
          <p className="app-main__empty">No context. Add a <code>context.json</code> in <code>data/</code>.</p>
        ) : (
          <WidgetGrid widgets={widgets} />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/d/static" replace />} />
      <Route path="/d/:mode" element={<DashboardView />} />
    </Routes>
  )
}

export default App
