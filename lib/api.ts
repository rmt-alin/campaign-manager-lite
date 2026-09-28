export type CampaignStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  start_date: string;
  end_date: string;
  budget_cents: number;
  spent_cents: number;
}

export interface DailyStats {
  date: string;
  impressions: number;
  clicks: number;
  spend_cents: number;
}

type Params = Record<string, string | number | null | undefined>;

export async function getJson<T>(path: string, params: Params = {}): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  const res = await fetch(qs ? `${path}?${qs}` : path);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `${res.status} ${res.statusText}`);
  }
  return res.json();
}
