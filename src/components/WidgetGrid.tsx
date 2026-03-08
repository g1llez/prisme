import type { Widget } from '../types/config'
import { Widget as WidgetComponent } from './Widget'
import './WidgetGrid.css'

interface WidgetGridProps {
  widgets: Widget[]
}

export function WidgetGrid({ widgets }: WidgetGridProps) {
  return (
    <div className="widget-grid">
      {widgets.map((widget) => (
        <WidgetComponent key={widget.id} widget={widget} />
      ))}
    </div>
  )
}
