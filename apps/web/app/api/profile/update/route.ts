import { prisma } from '@/lib/server/prisma';
import { getSupabaseRouteHandlerClient } from '@/lib/server/supabase';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const { firstName, lastName } = data as {
    firstName: string;
    lastName: string;
  };

  const { user } = await getSupabaseRouteHandlerClient();
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const updatedUser = await prisma.profile.update({
    where: { id: user.id },
    data: {
      firstName,
      lastName,
    },
  });

  if (!updatedUser) {
    return Response.json(
      { error: 'Unable to update user', updated: false },
      { status: 500 }
    );
  }

  return Response.json({ error: null, updated: true }, { status: 200 });
}
