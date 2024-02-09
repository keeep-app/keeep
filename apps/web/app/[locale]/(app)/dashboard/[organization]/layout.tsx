import { pick } from 'lodash';
import { NextIntlClientProvider } from 'next-intl';
import { notFound, redirect } from 'next/navigation';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

import { IntlMessages } from '@/lib/types/global';
import { prisma } from '@/lib/server/prisma';
import { SidebarProvider } from '@/lib/provider/sidebar';
import { getSupabaseServerComponentClient } from '@/lib/server/supabase';
import { PinboardLists } from '@/components/pinboard-lists';
import OrganizationSwitcher from '@/components/organization-switcher';
import { Breadcrumbs } from '@/components/sidebar-header-breadcrumbs';
import { MobileSidebarToggle } from '@/components/sidebar-header-mobile-toggle';
import { DesktopSidebarPane } from '@/components/sidebar-pane-desktop';
import { MobileSidebarPane } from '@/components/sidebar-pane-mobile';

type OrganizationLayoutProps = {
  children: React.ReactNode;
  params: { organization: string; locale: string };
};

export default async function OrganizationLayout({
  children,
  params: { organization, locale },
}: OrganizationLayoutProps) {
  unstable_setRequestLocale(locale);

  const messages = (await getMessages({ locale })) as IntlMessages;

  const { user } = await getSupabaseServerComponentClient();
  if (!user) return redirect('/login');

  const organizations = await prisma.organization.findMany({
    where: { members: { some: { id: user.id } } },
    include: { lists: true, _count: { select: { contacts: true } } },
  });

  const current = organizations.find(org => org.slug === organization);

  const sidebar = current ? (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <OrganizationSwitcher organizations={organizations} current={current} />
      </div>
      <nav className="flex flex-1 flex-col px-6">
        <PinboardLists
          sections={[
            {
              title: messages.Sidebar.sections.people,
              count: current._count.contacts,
              items: current.lists.map(list => ({
                ...list,
                href: `/dashboard/${current.slug}/${list.slug}`,
              })),
            },
          ]}
        />
      </nav>
    </>
  ) : null;

  if (!current && organizations[0]) {
    return redirect(`/dashboard/${organizations[0].slug}`);
  }

  if (!current) notFound();

  return (
    <SidebarProvider>
      <NextIntlClientProvider messages={pick(messages, 'Sidebar')}>
        <DesktopSidebarPane>{sidebar}</DesktopSidebarPane>
        <MobileSidebarPane>{sidebar}</MobileSidebarPane>
        <div className="lg:pl-72">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <MobileSidebarToggle />
            <Breadcrumbs base={current.slug} />
          </header>
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </NextIntlClientProvider>
    </SidebarProvider>
  );
}
