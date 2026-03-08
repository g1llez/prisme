export type WidgetScreen = 'permanent' | 'dynamic'

export interface Widget {
  id: string
  name: string
  type: string
  category: string
  url: string
  tags: string[]
  base_score: number
  screen: WidgetScreen
}

export interface ScoringRules {
  tag_match_weight: number
  exact_tag_bonus: number
  primary_focus_bonus: number
  urgency_multiplier: Record<string, number>
}

export interface DisplayConfig {
  min_score_display: number
  max_widgets_dynamic: number
  focus_score_threshold: number
  /** Context refresh interval (seconds) for /d/dynamic. Default: 5 */
  context_poll_interval_seconds?: number
}

export interface PrismeConfig {
  widgets: Widget[]
  scoring_rules: ScoringRules
  display_config: DisplayConfig
}

/** Conversation context (e.g. from OpenClaw) for the dynamic dashboard */
export interface PrismeContext {
  conversation_id?: string
  timestamp?: string
  transition_urgency?: number
  summary?: { brief?: string; primary_focus?: string }
  tags: string[]
}
