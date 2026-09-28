import type { NextRequest } from 'next/server';
import type { DailyStats } from '../../../lib/api';
import rows from '../../../mock-data/stats.json';

const RANGES = [7, 14, 30];
const LAST_DATE = rows.reduce((max, row) => (row.date > max ? row.date : max), '');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function daysBefore(isoDate: string, days: number): string {
  const date = new Date(isoDate);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const campaignId = request.nextUrl.searchParams.get('campaign_id');
  const days = Number(request.nextUrl.searchParams.get('days') ?? 7);
  if (!RANGES.includes(days)) {
    return Response.json({ message: `days must be one of ${RANGES.join(', ')}` }, { status: 400 });
  }

  // Longer ranges scan more data, so they are slower, like the real reporting API.
  await sleep(150 + days * 45);

  const from = daysBefore(LAST_DATE, days - 1);
  const byDate = new Map<string, DailyStats>();
  for (const row of rows) {
    if (row.date < from || (campaignId && row.campaign_id !== campaignId)) continue;
    const day = byDate.get(row.date) ?? { date: row.date, impressions: 0, clicks: 0, spend_cents: 0 };
    day.impressions += row.impressions;
    day.clicks += row.clicks;
    day.spend_cents += row.spend_cents;
    byDate.set(row.date, day);
  }

  return Response.json({
    data: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
  });
}
