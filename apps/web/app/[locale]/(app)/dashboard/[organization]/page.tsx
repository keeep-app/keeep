import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/server/prisma';
import Link from 'next/link';
import { LocalePageProps } from '@/lib/types/global';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: LocalePageProps) {
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  return {
    title: t('title'),
  };
}

type OrganizationPageProps = {
  params: { organization: string };
};

export default async function OrganizationPage({
  params: { organization: slug },
}: OrganizationPageProps) {
  const result = await prisma.organization.findUnique({
    where: { slug },
    include: { lists: true },
  });

  /**
   * WIP: THIS NEEDS TO BE DESIGNED
   */

  return (
    <div className="flex-1 space-y-4">
      <div className="space-y-2">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {result?.lists.length ? (
            result.lists.map(list => {
              return (
                <Link key={list.id} href={`/dashboard/${slug}/${list.slug}`}>
                  <Card key={list.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs font-medium opacity-50">
                        List
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium text-muted-foreground">
                        {list.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="text-center">No lists found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
