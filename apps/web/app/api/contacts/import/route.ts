import { prisma } from '@/lib/server/prisma';
import { getSupabaseRouteHandlerClient } from '@/lib/server/supabase';
import { LinkedInImportContact } from '@/lib/types/import-contacts';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { contacts, orgSlug, listSlug } = data as {
    contacts: LinkedInImportContact[];
    orgSlug: string;
    listSlug: string;
  };

  const { user } = await getSupabaseRouteHandlerClient();
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug, members: { some: { id: user.id } } },
    include: { attributes: true },
  });

  if (!organization) {
    return Response.json({ error: 'Organization not found' }, { status: 404 });
  }

  const list = await prisma.list.findUnique({
    where: { slug: listSlug },
  });

  if (!list) {
    return Response.json({ error: 'List not found' }, { status: 404 });
  }

  const attributes = organization.attributes;

  const firstNameAttribute = attributes.find(
    attribute => attribute.internalSlug === 'first-name'
  );
  const lastNameAttribute = attributes.find(
    attribute => attribute.internalSlug === 'last-name'
  );
  const emailAttribute = attributes.find(
    attribute => attribute.internalSlug === 'email'
  );

  if (!firstNameAttribute || !lastNameAttribute || !emailAttribute) {
    return Response.json(
      { error: 'Missing required attributes', created: false },
      { status: 400 }
    );
  }

  const contactsAttributesToCreate = contacts.map(contact => {
    return {
      [emailAttribute.id]: contact['Email Address'],
      [firstNameAttribute.id]: contact['First Name'],
      [lastNameAttribute.id]: contact['Last Name'],
    };
  });

  const updatedList = await prisma.list.update({
    where: {
      id: list.id,
    },
    data: {
      contacts: {
        create: contactsAttributesToCreate.map(attributes => {
          return {
            attributes,
            organizationId: organization.id,
          };
        }),
      },
    },
  });

  if (!updatedList) {
    return Response.json(
      { error: 'Unable to import contacts', created: false },
      { status: 500 }
    );
  }

  return Response.json({ error: null, created: true }, { status: 201 });
}
