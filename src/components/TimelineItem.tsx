import type { TimelineEvent } from '../lib/slackParser'

function tagClasses(tag: TimelineEvent['tag']): string {
  switch (tag) {
    case 'ISSUE':
      return 'bg-red-100 text-red-800 ring-red-200'
    case 'RESOLUTION':
      return 'bg-green-100 text-green-800 ring-green-200'
    case 'DEPLOYMENT':
      return 'bg-blue-100 text-blue-800 ring-blue-200'
    case 'KEY EVENT':
      return 'bg-purple-100 text-purple-800 ring-purple-200'
    case 'REFERENCE':
      return 'bg-gray-100 text-gray-800 ring-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 ring-gray-200'
  }
}

export function TimelineItem({ event }: { event: TimelineEvent }) {
  const messageWithLinks = event.message.replace(
    /(https?:\/\/\S+)/g,
    (m) => `<a href="${m}" target="_blank" rel="noreferrer" class="underline text-indigo-600">${m}</a>`
  )
  return (
    <div className="relative pl-8">
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-white ring-2 ring-indigo-400" />
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-gray-500">{event.timestamp}</div>
          <div className={`text-xs px-2 py-1 rounded-md ring-1 ${tagClasses(event.tag)}`}>
            {event.tag}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-700">
          <span className="font-medium mr-2">{event.user}</span>
          <span dangerouslySetInnerHTML={{ __html: messageWithLinks }} />
        </div>
        {event.isPinned && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-purple-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M14.847 4.613a2.25 2.25 0 0 1 3.182 3.182l-.476.476a.75.75 0 0 0 0 1.06l1.286 1.287a2.25 2.25 0 1 1-3.182 3.182l-3.44-3.44a.75.75 0 0 0-1.06 0l-6.22 6.22a.75.75 0 1 1-1.06-1.06l6.22-6.22a.75.75 0 0 0 0-1.06l-3.44-3.44a2.25 2.25 0 1 1 3.182-3.182l1.286 1.286a.75.75 0 0 0 1.06 0z" />
            </svg>
            <span>Pinned</span>
          </div>
        )}
      </div>
    </div>
  )
}


