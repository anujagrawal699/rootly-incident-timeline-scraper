import type { TimelineEvent } from '../lib/slackParser'
import { TimelineItem } from './TimelineItem'

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-500">
        No events yet. Upload a Slack messages.json to generate a timeline.
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-indigo-200 to-transparent" />
      <ol className="space-y-0">
        {events.map((event) => (
          <li key={event.id}>
            <TimelineItem event={event} />
          </li>
        ))}
      </ol>
    </div>
  )
}


