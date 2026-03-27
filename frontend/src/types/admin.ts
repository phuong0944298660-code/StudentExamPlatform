export type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export interface AdminMenuChild {
  key: string
  label: string
  route: string
  description: string
}

export interface AdminMenuGroup {
  key: string
  label: string
  icon: string
  baseRoute: string
  children: AdminMenuChild[]
}

export interface ActionItem {
  label: string
  tone?: Tone
  route?: string
  message?: string
}

export interface MetricItem {
  label: string
  value: string
  hint: string
  trend?: string
  tone?: Tone
}

export interface HighlightItem {
  title: string
  content: string
  tag: string
  tone?: Tone
  route?: string
}

export interface ProgressItem {
  label: string
  value: number
  total: number
  note: string
  tone?: Tone
}

export interface TableColumn {
  key: string
  label: string
  width?: number
  kind?: 'text' | 'tag'
  tones?: Record<string, Tone>
}

export type TableRow = Record<string, string | number>

export interface TableData {
  title: string
  description: string
  columns: TableColumn[]
  rows: TableRow[]
}

export interface DetailItem {
  label: string
  value: string
  tone?: Tone
}

export interface ListItem {
  title: string
  description: string
  meta: string
  tone?: Tone
  route?: string
}

export interface TimelineItem {
  time: string
  title: string
  description: string
  tone?: Tone
}

export interface LinkItem {
  label: string
  route: string
  description: string
}

export interface AdminSectionView {
  moduleKey: string
  sectionKey: string
  groupLabel: string
  sectionLabel: string
  title: string
  description: string
  badge: string
  emphasis?: string
  actions: ActionItem[]
  metrics: MetricItem[]
  highlights: HighlightItem[]
  progress?: ProgressItem[]
  table?: TableData
  details?: DetailItem[]
  list?: {
    title: string
    description: string
    items: ListItem[]
  }
  timeline?: {
    title: string
    description: string
    items: TimelineItem[]
  }
  related: LinkItem[]
}
