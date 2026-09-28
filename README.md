# Campaign Manager Lite

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/rmt-alin/campaign-manager-lite?quickstart=1)

A small Next.js app with two pages:

- **Campaigns**: all campaigns, with a name search and a status filter.
- **Dashboard**: daily delivery stats (impressions, clicks, CTR, spend) for one
  campaign or for all of them, over the last 7, 14 or 30 days.

The data comes from a mock API that lives in the same app (see below).

## Getting started

### GitHub Codespaces

Click the badge above. Alternatively, on the repository page press `,` (comma),
or click **Code → Codespaces → Create codespace on main**. Nothing needs to be
installed on your machine; all you need is a GitHub account and a browser.

Dependencies are installed and the dev server starts automatically. The app
runs on port 3000. If it doesn't open by itself, go to the **Ports** tab and
click the globe icon next to port 3000.

Pressing `.` instead opens github.dev, which is only an editor: it has no
terminal and can't run the app.

### Locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

| Command             | What it does               |
| ------------------- | -------------------------- |
| `npm run dev`       | Start the dev server       |
| `npm test`          | Run the unit tests (Vitest) |
| `npm run typecheck` | Type-check with TypeScript |
| `npm run build`     | Production build           |

## Project layout

```
app/
  campaigns/page.tsx   Campaigns page
  dashboard/page.tsx   Dashboard page (renders components/Dashboard.tsx)
  api/                 Mock API (route handlers)
components/            UI components
lib/
  api.ts               Types and the fetch helper
  metrics.ts           KPI calculations
  format.ts            Number, money and date formatting
mock-data/             JSON returned by the mock API
```

## Mock API

The API is a pair of Next.js route handlers in `app/api/` that read JSON from
`mock-data/`. Edit the JSON files to change what the endpoints return.
Responses are slightly delayed so they feel like a real backend.

Money values are integers in cents (`*_cents`).

| Endpoint             | Query params                                                                        | Returns                                               |
| -------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `GET /api/campaigns` | `search` (part of the name), `status` (`ACTIVE`, `INACTIVE`, `DRAFT`, `ARCHIVED`)   | `{ data: Campaign[] }`                                |
| `GET /api/stats`     | `days` (`7`, `14` or `30`), `campaign_id` (optional, all campaigns when left out)   | `{ data: DailyStats[] }`, one entry per day with delivery |

The stats data ends on 26 September 2026. "Last N days" counts back from that date.
