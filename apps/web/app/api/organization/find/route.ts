import { prisma } from '@/lib/server/prisma';
import { getSupabaseRouteHandlerClient } from '@/lib/server/supabase';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('org');

  if (!slug) {
    return Response.json(
      { error: 'No organization slug specified' },
      { status: 422 }
    );
  }

  const { user } = await getSupabaseRouteHandlerClient();
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const org = await prisma.organization.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!org) {
    return Response.json(
      { error: 'No organization found', found: false },
      { status: 404 }
    );
  }

  return Response.json({ error: null, found: true }, { status: 200 });
}
