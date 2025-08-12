import { useMemo, useState } from 'react'
import { parseSlackHistory, type TimelineEvent } from './lib/slackParser'
import { FileUploader } from './components/FileUploader'
import { Timeline } from './components/Timeline.tsx'
import { ExportButtons } from './components/ExportButtons'
import { TagFilters, type TagFilterState } from './components/TagFilters'
import { SummaryBar } from './components/SummaryBar'

function App() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [ascending, setAscending] = useState(true)
  const [filters, setFilters] = useState<TagFilterState>({
    'KEY EVENT': true,
    'DEPLOYMENT': true,
    'ISSUE': true,
    'RESOLUTION': true,
    'REFERENCE': true,
  })

  const handleFileParsed = (messages: any[]) => {
    try {
      const parsed = parseSlackHistory(messages as any)
      setEvents(parsed)
    } catch (err) {
      console.error('Parse error', err)
      setEvents([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img src="/image.png" alt="Rootly" className="h-8 w-8 rounded" />
                <h1 className="text-xl font-semibold">Rootly Incident Timeline Scraper</h1>
              </div>
              <p className="text-sm text-gray-500">Upload a Slack channel messages.json to generate a timeline</p>
            </div>
            <a
              href="https://www.rootly.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/80"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
              </svg>
              Rootly
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-1 space-y-4">
          <FileUploader onParsed={handleFileParsed} />
          <TagFilters value={filters} onChange={setFilters} />
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Sort</span>
              <button
                className="text-xs rounded-md bg-gray-100 px-2 py-1 ring-1 ring-gray-200 hover:bg-gray-200"
                onClick={() => setAscending((v) => !v)}
              >
                {ascending ? 'Oldest → Newest' : 'Newest → Oldest'}
              </button>
            </div>
          </div>
          <ExportButtons events={events} />
        </section>
        <section className="md:col-span-2">
          <div className="mb-4">
            <SummaryBar events={events} />
          </div>
          <Timeline
            events={useMemo(() => {
              const filtered = events.filter((e) => filters[e.tag])
              const sorted = [...filtered].sort((a, b) =>
                ascending ? parseFloat(a.id) - parseFloat(b.id) : parseFloat(b.id) - parseFloat(a.id)
              )
              return sorted
            }, [events, filters, ascending])}
          />
        </section>
      </main>
    </div>
  )
}

export default App
