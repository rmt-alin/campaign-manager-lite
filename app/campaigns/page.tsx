'use client';

import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import { Bar } from '../../components/Bar';
import { StatusBadge } from '../../components/StatusBadge';
import { type Campaign, type CampaignStatus, getJson } from '../../lib/api';
import { formatDate, formatMoney } from '../../lib/format';
import { useDebouncedValue } from '../../lib/hooks';

type StatusFilter = CampaignStatus | 'ALL';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function CampaignsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, error, isLoading } = useSWR(['/api/campaigns', debouncedSearch], () =>
    getJson<{ data: Campaign[] }>('/api/campaigns', {
      search: debouncedSearch,
      status: status === 'ALL' ? null : status,
    }),
  );
  const campaigns = data?.data ?? [];

  return (
    <>
      <div className="page-header">
        <h1>Campaigns</h1>
        {data && <span className="muted">{campaigns.length} campaigns</span>}
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error">Could not load campaigns: {error.message}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Flight</th>
              <th className="num">Budget</th>
              <th>Spent</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="muted">
                  Loading...
                </td>
              </tr>
            )}
            {data && campaigns.length === 0 && (
              <tr>
                <td colSpan={5} className="muted">
                  No campaigns match your filters.
                </td>
              </tr>
            )}
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>
                  <Link href={`/dashboard?campaign_id=${campaign.id}`}>{campaign.name}</Link>
                </td>
                <td>
                  <StatusBadge status={campaign.status} />
                </td>
                <td>
                  {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                </td>
                <td className="num">{formatMoney(campaign.budget_cents)}</td>
                <td>
                  <Bar ratio={campaign.spent_cents / campaign.budget_cents} label={formatMoney(campaign.spent_cents)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
