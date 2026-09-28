import type { CampaignStatus } from '../lib/api';

const LABELS: Record<CampaignStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DRAFT: 'Draft',
  ARCHIVED: 'Archived',
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
