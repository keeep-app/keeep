import { prisma } from '@/lib/server/prisma';
import { LocalePageProps } from '@/lib/types/global';
import { ContactTable } from './table';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export async function generateMetadata({
  params: { locale, list: slug },
}: LocalePageProps & ListPageProps) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'LocaleLayout' });
  const list = await prisma.list.findUnique({
    where: { slug },
  });

  return {
    title: list?.name ?? t('title'),
  };
}

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
    <div className="mb-24 flex-1 space-y-4 md:mb-0">
      <ScrollArea className="w-screen md:w-full">
        <div className="mr-9 space-y-2 md:mr-0">
          <ContactTable
            contacts={contactsResult.contacts}
            attributes={attributesResult.attributes}
            list={list}
            organization={organization}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
