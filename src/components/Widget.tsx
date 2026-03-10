import { useTranslation } from 'react-i18next'
import type { Widget as WidgetType } from '../types/config'
import './Widget.css'

interface WidgetProps {
  widget: WidgetType
}

export function Widget({ widget }: WidgetProps) {
  const { t } = useTranslation()
  const isPlaceholder =
    !widget.url || widget.url.includes('...') || widget.url.includes('/document/d/...')

  return (
    <article className="widget">
      <header className="widget__header">
        <h2 className="widget__title">{widget.name}</h2>
        <span className="widget__meta">{widget.category}</span>
      </header>
      <div className="widget__body">
        {widget.type === 'iframe' && !isPlaceholder ? (
          <iframe
            title={widget.name}
            src={widget.url}
            className="widget__iframe"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="widget__placeholder">
            <span>{t('widget.label')} {widget.name}</span>
            <span className="widget__placeholder-url">{widget.url || '—'}</span>
          </div>
        )}
      </div>
    </article>
  )
}
