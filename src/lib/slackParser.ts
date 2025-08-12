export interface SlackMessage {
  user: string
  text: string
  ts: string
  bot_id?: string
  pinned_to?: string[]
}

export type TimelineTag = 'KEY EVENT' | 'DEPLOYMENT' | 'ISSUE' | 'REFERENCE' | 'RESOLUTION'

export interface TimelineEvent {
  id: string
  timestamp: string
  user: string
  message: string
  tag: TimelineTag
  isPinned: boolean
}

const TAG_KEYWORDS: Record<TimelineTag, string[]> = {
  'DEPLOYMENT': ['deploying', 'rolled back', 'reverting', 'deploy'],
  'ISSUE': ['error', 'failed', 'latency', 'down', 'bug', 'broken'],
  'RESOLUTION': ['mitigated', 'resolved', 'fixed', 'monitoring', 'stable'],
  'KEY EVENT': ['investigating'],
  'REFERENCE': [],
}

function classifyTag(messageText: string): TimelineTag | null {
  const text = messageText.toLowerCase()
  // Order of evaluation matters per requirements
  for (const tag of ['DEPLOYMENT', 'ISSUE', 'RESOLUTION', 'KEY EVENT'] as TimelineTag[]) {
    const keywords = TAG_KEYWORDS[tag]
    if (keywords.some((kw) => text.includes(kw))) return tag
  }
  if (text.includes('http://') || text.includes('https://')) return 'REFERENCE'
  return null
}

export function parseSlackHistory(messages: SlackMessage[]): TimelineEvent[] {
  if (!Array.isArray(messages)) return []

  const events: TimelineEvent[] = []

  for (const msg of messages) {
    if (!msg || msg.bot_id || !msg.text) continue

    const isPinned = Array.isArray(msg.pinned_to) && msg.pinned_to.length > 0
    const dateString = new Date(parseFloat(msg.ts) * 1000).toLocaleString()

    let tag: TimelineTag | null = null
    if (isPinned) {
      tag = 'KEY EVENT'
    } else {
      tag = classifyTag(msg.text)
    }

    if (!tag) continue

    events.push({
      id: msg.ts,
      timestamp: dateString,
      user: msg.user ?? 'unknown',
      message: msg.text,
      tag,
      isPinned,
    })
  }

  // Sort by timestamp ascending
  events.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
  return events
}


