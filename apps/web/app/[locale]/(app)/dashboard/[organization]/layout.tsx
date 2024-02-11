import { pick } from 'lodash';
import { NextIntlClientProvider } from 'next-intl';
import { notFound, redirect } from 'next/navigation';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

import { IntlMessages } from '@/lib/types/global';
import { prisma } from '@/lib/server/prisma';
import { getSupabaseServerComponentClient } from '@/lib/server/supabase';
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';
import {
  ResizableSidebar,
  ResizableSidebarGroup,
  ResizableSidebarToggle,
} from '@/components/dashboard/sidebar-resizable';
import { cookies } from 'next/headers';
import { ScrollArea } from '@/components/ui/scroll-area';
import OrganizationSwitcher from '@/components/dashboard/sidebar-organization-switcher';
import { PinboardLists } from '@/components/dashboard/sidebar-pinboard';
import { Breadcrumbs } from '@/components/dashboard/header-breadcrumbs';

type OrganizationLayoutProps = {
  children: React.ReactNode;
  params: { organization: string; locale: string };
};

export default async function OrganizationLayout({
  children,
  params: { organization, locale },
}: OrganizationLayoutProps) {
  unstable_setRequestLocale(locale);

  const resizable = getResizableLayoutFromCookies();
  const messages = (await getMessages({ locale })) as IntlMessages;

  const { user } = await getSupabaseServerComponentClient();
  if (!user) return redirect('/login');

  const organizations = await prisma.organization.findMany({
    where: { members: { some: { id: user.id } } },
    include: { lists: true, _count: { select: { contacts: true } } },
  });

  const current = organizations.find(org => org.slug === organization);

  if (!current && organizations[0]) {
    return redirect(`/dashboard/${organizations[0].slug}`);
  }

  if (!current) notFound();

  return (
    <NextIntlClientProvider messages={pick(messages, 'Sidebar')}>
      <ResizableSidebarGroup
        direction="horizontal"
        defaultCollapsed={resizable.defaultCollapsed}
      >
        <ResizableSidebar defaultSize={resizable.defaultLayout?.[0]}>
          <div className="flex h-16 items-center">
            <OrganizationSwitcher
              organizations={organizations}
              current={current}
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <PinboardLists
              sections={[
                {
                  title: messages.Sidebar.sections.people,
                  count: current._count.contacts,
                  items: current.lists.map(list => ({
                    ...list,
                    name: list.name,
                    href: `/dashboard/${current.slug}/${list.slug}`,
                  })),
                },
              ]}
            />
          </nav>
        </ResizableSidebar>
        <ResizableHandle className="w-[1px] bg-gray-100 transition-colors duration-200 hover:bg-gray-300" />
        <ResizablePanel defaultSize={resizable.defaultLayout?.[1]}>
          <header className="flex h-16 items-center gap-x-4 border-b border-gray-100 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <ResizableSidebarToggle className="md:hidden" />
            <Breadcrumbs
              slots={[
                {
                  type: 'organization',
                  options: organizations.map(org => ({
                    name: org.name,
                    slug: org.slug,
                    href: `/dashboard/${org.slug}`,
                  })),
                },
                {
                  type: 'list',
                  options: current.lists.map(list => ({
                    name: list.name,
                    slug: list.slug,
                    href: `/dashboard/${current.slug}/${list.slug}`,
                    icon: list.icon,
                  })),
                },
              ]}
            />
          </header>
          <main>
            <ScrollArea className="h-screen p-4 sm:p-6 lg:p-8">
              {children}
            </ScrollArea>
          </main>
        </ResizablePanel>
      </ResizableSidebarGroup>
    </NextIntlClientProvider>
  );
}

function getResizableLayoutFromCookies(): {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
} {
  try {
    const layout = cookies().get('react-resizable-panels:layout');
    const collapsed = cookies().get('react-resizable-panels:collapsed');

    return {
      defaultLayout: layout ? JSON.parse(layout.value) : undefined,
      defaultCollapsed: collapsed ? JSON.parse(collapsed.value) : undefined,
    };
  } catch {
    return {
      defaultLayout: undefined,
      defaultCollapsed: undefined,
    };
  }
}
