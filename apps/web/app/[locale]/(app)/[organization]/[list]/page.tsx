import { Metadata } from 'next';
import { prisma } from '@/lib/server/prisma';
import { TableDemo } from '@/components/demo-table';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.',
};

type ListPageProps = {
  params: { list: string; organization: string };
};

export default async function ListPage({
  params: { list, organization },
}: ListPageProps) {
  const contactsResult = await prisma.list.findUnique({
    where: { slug: list },
    include: { contacts: true },
  });

  const attributesResult = await prisma.organization.findUnique({
    where: { slug: organization },
    select: { attributes: true },
  });

  if (!contactsResult?.contacts || !attributesResult?.attributes) return null;

  return (
    <div className="flex-1 space-y-4">
      <div className="space-y-2">
        <TableDemo
          attributes={attributesResult.attributes}
          data={contactsResult.contacts}
        />
      </div>
    </div>
  );
}
