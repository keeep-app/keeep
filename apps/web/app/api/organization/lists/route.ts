import { prisma } from '@/lib/server/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse as Response } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const userResponse = await supabase.auth.getUser();
  if (!userResponse.data.user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const slug = searchParams.get('organization-slug');
  if (!slug) {
    return Response.json(
      { error: 'No organization slug specified' },
      { status: 422 }
    );
  }

  const supabaseId = userResponse.data.user.id;
  const organization = await prisma.organization.findUnique({
    where: { slug, members: { some: { supabaseId } } },
    include: { lists: true },
  });
  if (!organization) {
    return Response.json({ error: 'No organization found' }, { status: 404 });
  }

  return Response.json({ data: organization }, { status: 200 });
}
