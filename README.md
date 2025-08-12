# Rootly Incident Timeline Scraper (MVP)

A single-page web app that parses a Slack channel export (`messages.json`) and instantly generates a clean, exportable incident timeline. Built to showcase modern frontend and data processing for Rootly.

## Why this MVP?

When an incident is over, engineers manually scroll through hundreds of Slack messages to reconstruct the timeline for a post‑mortem. This is slow, error‑prone, and tedious. The Incident Timeline Scraper automates that process: upload a `messages.json`, and it extracts key events using simple, explainable rules.

## What problem does it solve?

- Reduces manual effort to compile incident timelines from Slack
- Highlights important messages (pins, deploys, issues, resolutions, references)
- Produces shareable output (Markdown, CSV, JSON) for post‑mortems or Rootly runbooks

## Features

- Upload or drag‑and‑drop a Slack `messages.json`
- Smart parsing rules (skip bots, prioritize pinned, keyword tagging, link detection)
- Timeline with visual badges and a vertical rail
- Filters by tag, sort order toggle
- Summary bar (totals and per‑tag counts)
- Export: Markdown, CSV, and JSON
- “Load Sample Data” for instant demo
- Rootly branding in the header

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- Static build (suitable for Vercel/Netlify)

## Data Model

```ts
// src/lib/slackParser.ts
export interface SlackMessage {
  user: string
  text: string
  ts: string
  bot_id?: string
  pinned_to?: string[]
}

export interface TimelineEvent {
  id: string
  timestamp: string
  user: string
  message: string
  tag: 'KEY EVENT' | 'DEPLOYMENT' | 'ISSUE' | 'REFERENCE' | 'RESOLUTION'
  isPinned: boolean
}
```

## Parsing Rules (ordered)

1. Ignore if `bot_id` exists or `text` is empty
2. Pinned messages → `KEY EVENT`
3. Keyword tags (case‑insensitive):
   - `DEPLOYMENT`: deploying, rolled back, reverting, deploy
   - `ISSUE`: error, failed, latency, down, bug, broken
   - `RESOLUTION`: mitigated, resolved, fixed, monitoring, stable
   - `KEY EVENT`: investigating
4. Links (`http://` or `https://`) → `REFERENCE`
5. Convert Slack `ts` → `new Date(parseFloat(ts) * 1000).toLocaleString()`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use “Load Sample Data” or upload your Slack `messages.json`.

## Build

```bash
npm run build
```

Deploy the `dist/` folder to Vercel or Netlify.

## Project Structure

- `src/lib/slackParser.ts` – parsing engine and types
- `src/components/*` – UI components
- `public/samples/messages_incident.json` – demo data

## Future Enhancements

- Map Slack user IDs to real names with a `users.json`
- Keyword tuning via a settings panel
- Phase grouping (Declare → Mitigate → Resolve)
- Dark mode and accessibility passes
- One‑click export to a Rootly post‑mortem template

---

Built with ❤️ to showcase incident tooling for Rootly.
