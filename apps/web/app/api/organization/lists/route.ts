import { NextRequest, NextResponse as Response } from 'next/server';

import { prisma } from '@/lib/server/prisma';
import { getSupabaseRouteHandlerClient } from '@/lib/server/supabase';

export async function GET(req: NextRequest) {
  const { user } = await getSupabaseRouteHandlerClient();
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const slug = req.nextUrl.searchParams.get('org');
  if (!slug) {
    return Response.json(
      { error: 'No organization slug specified' },
      { status: 422 }
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { slug, members: { some: { supabaseId: user.id } } },
    include: { lists: true },
  });

  if (!organization) {
    return Response.json({ error: 'No organization found' }, { status: 404 });
  }

  return Response.json({ data: organization }, { status: 200 });
}
