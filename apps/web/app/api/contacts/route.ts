import { prisma } from '@/lib/server/prisma';
import { getSupabaseRouteHandlerClient } from '@/lib/server/supabase';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  const { contactIds } = data as {
    contactIds: string[];
    orgSlug: string;
    listSlug: string;
  };

  const { user } = await getSupabaseRouteHandlerClient();
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const deletedContacts = await prisma.contact.deleteMany({
    where: {
      externalId: {
        in: contactIds,
      },
      organization: {
        members: { some: { id: user.id } },
      },
    },
  });

  if (!deletedContacts) {
    return Response.json(
      { error: 'Unable to delete contacts', deleted: false },
      { status: 500 }
    );
  }

  return Response.json({
    deletedContacts: deletedContacts.count,
    deleted: true,
  });
}
