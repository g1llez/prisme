import { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import type { PrismeConfig, PrismeContext } from './types/config'
import { WidgetGrid } from './components/WidgetGrid'
import { filterWidgetsByContext } from './utils/filterWidgets'
import { STORAGE_KEY } from './i18n'
import './App.css'

type DashboardMode = 'static' | 'dynamic' | 'focus'

function DashboardView() {
  const { t, i18n } = useTranslation()
  const { mode } = useParams<{ mode: string }>()
  const dashboardMode: DashboardMode =
    mode === 'static' || mode === 'dynamic' || mode === 'focus' ? mode : 'static'

  const titleKeyByMode: Record<DashboardMode, string> = {
    static: 'dashboard.static',
    dynamic: 'dashboard.dynamic',
    focus: 'dashboard.focus',
  }
  useLayoutEffect(() => {
    document.documentElement.lang = i18n.language
    const title = t(titleKeyByMode[dashboardMode])
    const appTitle = t('app.title')
    document.title = title ? `${appTitle} — ${title}` : appTitle
    return () => {
      document.title = t('app.title')
    }
  }, [dashboardMode, i18n.language, t])

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

  const setLanguage = (lng: 'en' | 'fr') => {
    i18n.changeLanguage(lng)
    localStorage.setItem(STORAGE_KEY, lng)
  }

  const langSwitcher = (
    <nav className="app-header__lang" aria-label="Language">
      <button
        type="button"
        className={'app-header__lang-btn' + (i18n.language === 'en' ? ' is-active' : '')}
        onClick={() => setLanguage('en')}
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        className={'app-header__lang-btn' + (i18n.language === 'fr' ? ' is-active' : '')}
        onClick={() => setLanguage('fr')}
        aria-pressed={i18n.language === 'fr'}
      >
        FR
      </button>
    </nav>
  )

  if (error) {
    return (
      <div className="app app--error">
        <header className="app-header">
          <h1>{t('app.title')}</h1>
          {langSwitcher}
        </header>
        <div className="app__message">
          <p>{t('error.configFailed', { message: error })}</p>
          <p>{t('error.configHint')}</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="app app--loading">
        <header className="app-header">
          <h1>{t('app.title')}</h1>
          {langSwitcher}
        </header>
        <div className="app__message">
          <p>{t('loading.config')}</p>
        </div>
      </div>
    )
  }

  const labels: Record<DashboardMode, string> = {
    static: t('dashboard.static'),
    dynamic: t('dashboard.dynamic'),
    focus: t('dashboard.focus'),
  }

  let widgets = config.widgets
  if (dashboardMode === 'dynamic') {
    if (context === undefined) {
      return (
        <div className="app app--loading">
          <header className="app-header">
            <h1>{t('app.title')}</h1>
            {langSwitcher}
          </header>
          <div className="app__message">
            <p>{t('loading.context')}</p>
          </div>
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
        <h1>{t('app.title')}</h1>
        <span className="app-header__sub">{labels[dashboardMode]}</span>
        {langSwitcher}
      </header>
      <main className="app-main">
        {dashboardMode === 'dynamic' && context === null ? (
          <p className="app-main__empty">{t('empty.noContext')}</p>
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
