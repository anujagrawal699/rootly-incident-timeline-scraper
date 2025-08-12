import type { TimelineEvent } from '../lib/slackParser'

export function SummaryBar({ events }: { events: TimelineEvent[] }) {
  const total = events.length
  const byTag = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.tag] = (acc[e.tag] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="bg-white rounded-lg border p-4 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        <span className="font-medium">Total Events:</span> {total}
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        {Object.entries(byTag).map(([tag, count]) => (
          <span key={tag} className="rounded-md bg-gray-100 px-2 py-1 ring-1 ring-gray-200">
            {tag}: {count}
          </span>
        ))}
      </div>
    </div>
  )
}


