import { Dashboard } from '../../components/Dashboard';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { campaign_id } = await searchParams;

  return <Dashboard initialCampaignId={typeof campaign_id === 'string' ? campaign_id : ''} />;
}
