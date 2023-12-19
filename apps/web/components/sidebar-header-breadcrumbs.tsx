'use client';

import { useSWR } from '@/lib/swr';
import { List, Organization } from '@prisma/client';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Button } from './ui/button';
import { ReactNode } from 'react';

export function Breadcrumbs({ base }: { base: string }) {
  const { data, isLoading, error } = useSWR<Organization & { lists: List[] }>(
    '/api/organization/lists?organization-slug=' + base
  );

  const segments = useSelectedLayoutSegments();
  const current = segments[segments.length - 1];

  if (isLoading || !data || error)
    return <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />;

  return (
    <nav className="flex flex-1 items-center gap-x-2 self-stretch lg:gap-x-2">
      <BreadcrumbItem href={`/${base}`} active={segments.length === 0}>
        Dashboard
      </BreadcrumbItem>
      {segments.map(slug => {
        const list = data.lists.find(list => list.slug === slug);
        return list ? (
          <>
            <div role="separator" className="text-xs opacity-50">
              /
            </div>
            <BreadcrumbItem
              key={list.id}
              href={`/${base}/${list.slug}`}
              active={slug === current}
            >
              <span>
                <span className="pr text-base">{list.icon}</span> {list.name}
              </span>
            </BreadcrumbItem>
          </>
        ) : null;
      })}
    </nav>
  );
}

function BreadcrumbItem({
  href,
  children,
  active,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
}) {
  return active ? (
    <div className="flex h-8 items-center gap-x-4 px-2 text-sm font-semibold lg:gap-x-6">
      {children}
    </div>
  ) : (
    <Button
      asChild
      variant="ghost"
      className="flex h-8 items-center gap-x-4 px-2 text-sm font-semibold opacity-50 lg:gap-x-6"
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
