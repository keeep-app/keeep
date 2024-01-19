'use client';

import { Fragment, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';

type BreadcrumbOption = {
  name: string;
  href: string;
  slug: string;
  icon?: string | null;
};

type Breadcrumb = {
  type: 'organization' | 'list';
  options?: BreadcrumbOption[];
};

export function Breadcrumbs({ slots }: { slots: Breadcrumb[] }) {
  const params = useParams();

  const items = slots.filter(({ type }) => params[type]);

  return (
    <nav className="flex flex-1 items-center gap-x-2 self-stretch lg:gap-x-2">
      {items.map(({ type, options }, i, arr) => {
        const isLastItem = i == arr.length - 1;
        let current: BreadcrumbOption | undefined = undefined;

        if (type === 'organization') {
          current = options?.find(org => org.slug === params.organization);
        }

        if (type === 'list') {
          current = options?.find(list => list.slug === params.list);
        }

        return current ? (
          <Fragment key={current.href}>
            <BreadcrumbItem href={current.href} active={isLastItem}>
              <span>
                {current.icon && (
                  <span className="pr-1 text-base">{current.icon}</span>
                )}
                {current.name}
              </span>
            </BreadcrumbItem>
            {!isLastItem && arr.length > 1 && (
              <div role="separator" className="text-xs opacity-50">
                /
              </div>
            )}
          </Fragment>
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
