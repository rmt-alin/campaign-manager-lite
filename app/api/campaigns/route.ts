import type { NextRequest } from 'next/server';
import type { Campaign } from '../../../lib/api';
import data from '../../../mock-data/campaigns.json';

const campaigns = data as Campaign[];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status');
  const search = (request.nextUrl.searchParams.get('search') ?? '').toLowerCase();

  await sleep(250);

  return Response.json({
    data: campaigns.filter(
      (campaign) => (!status || campaign.status === status) && campaign.name.toLowerCase().includes(search),
    ),
  });
}
