import type { Widget } from '../types/config'

/** Returns widgets that have at least one tag in common with the context. */
export function filterWidgetsByContext(widgets: Widget[], contextTags: string[]): Widget[] {
  const ctxSet = new Set(contextTags.map((t) => t.toLowerCase()))
  return widgets.filter((w) =>
    w.tags.some((t) => ctxSet.has(t.toLowerCase()))
  )
}
