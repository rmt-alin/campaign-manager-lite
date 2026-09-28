import { describe, expect, it } from 'vitest';
import { cpc, ctr, summarize } from './metrics';

const day = (date: string, impressions: number, clicks: number, spend_cents: number) => ({
  date,
  impressions,
  clicks,
  spend_cents,
});

describe('ctr', () => {
  it('divides clicks by impressions', () => {
    expect(ctr(5, 1000)).toBe(0.005);
  });

  it('is 0 without impressions', () => {
    expect(ctr(0, 0)).toBe(0);
  });
});

describe('cpc', () => {
  it('is 0 without clicks', () => {
    expect(cpc(500, 0)).toBe(0);
  });
});

describe('summarize', () => {
  it('returns zeros for no data', () => {
    expect(summarize([])).toEqual({ impressions: 0, clicks: 0, spendCents: 0, ctr: 0, cpcCents: 0 });
  });

  it('adds up the daily totals', () => {
    const summary = summarize([day('2026-09-01', 1000, 10, 500), day('2026-09-02', 3000, 20, 1300)]);

    expect(summary).toMatchObject({ impressions: 4000, clicks: 30, spendCents: 1800, cpcCents: 60 });
  });
});
