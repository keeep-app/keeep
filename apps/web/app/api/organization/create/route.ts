import { prisma } from '@/lib/server/prisma';
import { getSupabaseRouteHandlerClient } from '@/lib/server/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { name, slug, avatar } = data as {
    name: string;
    slug: string;
    avatar: string;
  };

  const { user } = await getSupabaseRouteHandlerClient();
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const createdOrg = await prisma.organization.create({
    data: {
      name,
      slug,
      logo: avatar,
      members: {
        connect: [{ id: user.id }],
      },
    },
  });

  if (!createdOrg) {
    return Response.json(
      { error: 'Unable to create organization', created: false },
      { status: 500 }
    );
  }

  return Response.json({ error: null, created: true }, { status: 201 });
}
