import type { TimelineEvent } from '../lib/slackParser'

export type TagFilterState = Record<TimelineEvent['tag'], boolean>

interface TagFiltersProps {
  value: TagFilterState
  onChange: (next: TagFilterState) => void
}

const TAG_ORDER: TimelineEvent['tag'][] = [
  'KEY EVENT',
  'DEPLOYMENT',
  'ISSUE',
  'RESOLUTION',
  'REFERENCE',
]

export function TagFilters({ value, onChange }: TagFiltersProps) {
  const toggle = (tag: TimelineEvent['tag']) => {
    onChange({ ...value, [tag]: !value[tag] })
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h2 className="text-base font-semibold mb-2">Filters</h2>
      <div className="flex flex-wrap gap-2">
        {TAG_ORDER.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`text-xs px-2 py-1 rounded-md ring-1 ${
              value[tag]
                ? 'bg-indigo-600 text-white ring-indigo-600'
                : 'bg-gray-100 text-gray-700 ring-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}


