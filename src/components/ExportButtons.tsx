import type { TimelineEvent } from '../lib/slackParser'

interface ExportButtonsProps {
  events: TimelineEvent[]
}

function toMarkdown(events: TimelineEvent[]): string {
  const header = '# Incident Timeline\n\n'
  const lines = events.map((e) => `- ${e.timestamp} — [${e.tag}] ${e.user}: ${e.message}`)
  return header + lines.join('\n') + '\n'
}

function toCSV(events: TimelineEvent[]): string {
  const header = ['id', 'timestamp', 'user', 'message', 'tag', 'isPinned']
  const escape = (v: string) => '"' + v.replaceAll('"', '""') + '"'
  const rows = events.map((e) => [e.id, e.timestamp, e.user, e.message, e.tag, String(e.isPinned)])
  return [header.join(','), ...rows.map((r) => r.map((c) => escape(String(c))).join(','))].join('\n')
}

export function ExportButtons({ events }: ExportButtonsProps) {
  const copyMarkdown = async () => {
    const md = toMarkdown(events)
    await navigator.clipboard.writeText(md)
    alert('Copied Markdown to clipboard')
  }

  const exportCSV = () => {
    const csv = toCSV(events)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'incident_timeline.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportJSON = () => {
    const json = JSON.stringify(events, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'incident_timeline.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg border p-4 flex flex-col gap-2">
      <h2 className="text-base font-semibold">Export</h2>
      <button
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        onClick={copyMarkdown}
        disabled={events.length === 0}
      >
        Copy as Markdown
      </button>
      <button
        className="inline-flex items-center justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50"
        onClick={exportCSV}
        disabled={events.length === 0}
      >
        Export as CSV
      </button>
      <button
        className="inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-50"
        onClick={exportJSON}
        disabled={events.length === 0}
      >
        Export as JSON
      </button>
    </div>
  )
}


