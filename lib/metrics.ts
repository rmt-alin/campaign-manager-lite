import type { DailyStats } from './api';

export interface StatsSummary {
  impressions: number;
  clicks: number;
  spendCents: number;
  ctr: number;
  cpcCents: number;
}

export function ctr(clicks: number, impressions: number): number {
  return impressions > 0 ? clicks / impressions : 0;
}

export function cpc(spendCents: number, clicks: number): number {
  return clicks > 0 ? spendCents / clicks : 0;
}

export function summarize(days: DailyStats[]): StatsSummary {
  let impressions = 0;
  let clicks = 0;
  let spendCents = 0;
  let ctrTotal = 0;

  for (const day of days) {
    impressions += day.impressions;
    clicks += day.clicks;
    spendCents += day.spend_cents;
    ctrTotal += ctr(day.clicks, day.impressions);
  }

  return {
    impressions,
    clicks,
    spendCents,
    ctr: days.length > 0 ? ctrTotal / days.length : 0,
    cpcCents: cpc(spendCents, clicks),
  };
}
