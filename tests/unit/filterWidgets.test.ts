import { describe, it, expect } from 'vitest'
import { filterWidgetsByContext } from '../../src/utils/filterWidgets'
import type { Widget } from '../../src/types/config'

function w(id: string, tags: string[]): Widget {
  return {
    id,
    name: id,
    type: 'iframe',
    category: 'test',
    url: '',
    tags,
    base_score: 50,
    screen: 'dynamic',
  }
}

describe('filterWidgetsByContext', () => {
  it('returns widgets that share at least one tag with context (case insensitive)', () => {
    const widgets = [w('a', ['bitcoin', 'crypto']), w('b', ['weather']), w('c', ['Bitcoin', 'mining'])]
    const contextTags = ['bitcoin', 'mining']
    expect(filterWidgetsByContext(widgets, contextTags)).toHaveLength(2)
    expect(filterWidgetsByContext(widgets, contextTags).map((x) => x.id)).toEqual(['a', 'c'])
  })

  it('returns empty array when no widget matches', () => {
    const widgets = [w('a', ['bitcoin']), w('b', ['weather'])]
    expect(filterWidgetsByContext(widgets, ['sport'])).toHaveLength(0)
  })

  it('returns all widgets when context tags match all', () => {
    const widgets = [w('a', ['x']), w('b', ['y'])]
    expect(filterWidgetsByContext(widgets, ['x', 'y'])).toHaveLength(2)
  })

  it('returns empty array when context tags are empty', () => {
    const widgets = [w('a', ['bitcoin'])]
    expect(filterWidgetsByContext(widgets, [])).toHaveLength(0)
  })
})
