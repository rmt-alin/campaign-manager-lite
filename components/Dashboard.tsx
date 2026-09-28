'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { type Campaign, type DailyStats, getJson } from '../lib/api';
import { formatDay, formatMoney, formatNumber, formatPercent } from '../lib/format';
import { ctr, summarize } from '../lib/metrics';
import { Bar } from './Bar';

const RANGES = [7, 14, 30];

export function Dashboard({ initialCampaignId }: { initialCampaignId: string }) {
  const [campaignId, setCampaignId] = useState(initialCampaignId);
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: campaigns } = useSWR('/api/campaigns', (path: string) => getJson<{ data: Campaign[] }>(path));

  useEffect(() => {
    setLoading(true);
    setError(null);
    getJson<{ data: DailyStats[] }>('/api/stats', { campaign_id: campaignId, days })
      .then((res) => setStats(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [campaignId, days]);

  const summary = summarize(stats);
  const maxImpressions = Math.max(1, ...stats.map((day) => day.impressions));
  const options = [...(campaigns?.data ?? [])].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        {loading && <span className="muted">Loading...</span>}
      </div>

      <div className="toolbar">
        <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
          <option value="">All campaigns</option>
          {options.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
        <div className="segmented">
          {RANGES.map((range) => (
            <button
              key={range}
              type="button"
              className={range === days ? 'active' : undefined}
              onClick={() => setDays(range)}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">Could not load stats: {error}</p>}

      <div className="tiles">
        <Tile label="Impressions" value={formatNumber(summary.impressions)} />
        <Tile label="Clicks" value={formatNumber(summary.clicks)} />
        <Tile label="CTR" value={formatPercent(summary.ctr)} />
        <Tile label="Spend" value={formatMoney(summary.spendCents)} />
        <Tile label="CPC" value={formatMoney(summary.cpcCents)} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Impressions</th>
              <th className="num">Clicks</th>
              <th className="num">CTR</th>
              <th className="num">Spend</th>
            </tr>
          </thead>
          <tbody>
            {!loading && stats.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No delivery in this period.
                </td>
              </tr>
            )}
            {stats.map((day) => (
              <tr key={day.date}>
                <td>{formatDay(day.date)}</td>
                <td>
                  <Bar ratio={day.impressions / maxImpressions} label={formatNumber(day.impressions)} />
                </td>
                <td className="num">{formatNumber(day.clicks)}</td>
                <td className="num">{formatPercent(ctr(day.clicks, day.impressions))}</td>
                <td className="num">{formatMoney(day.spend_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="tile">
      <div className="tile-label">{label}</div>
      <div className="tile-value">{value}</div>
    </div>
  );
}
