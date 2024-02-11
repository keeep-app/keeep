'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { useResizable } from './sidebar-resizable';
import { forwardRef } from 'react';

type PinboardListItemButton = {
  icon: React.ReactNode;
  name: string;
  href: string;
  slug: string;
};

type PinboardListsProps = {
  sections: {
    title: string;
    count: number;
    items: PinboardListItemButton[];
  }[];
};

export function PinboardLists({ sections }: PinboardListsProps) {
  const { isCollapsed } = useResizable();

  return (
    <div className="pb-12">
      <div className={cn('space-y-4 p-4', isCollapsed() ? 'px-1' : '')}>
        {sections.map(section => {
          return (
            <div key={section.title}>
              {!isCollapsed() && (
                <h2 className="mb-4 flex items-center justify-between font-accent text-lg font-semibold">
                  {section.title}
                  <Badge variant="accent" tabular="numeric">
                    {section.count}
                  </Badge>
                </h2>
              )}
              {section.items.map(item => {
                return isCollapsed() ? (
                  <Tooltip key={item.slug}>
                    <TooltipTrigger asChild>
                      <PinboardListButton item={item} />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-4"
                    >
                      <span className="ml-auto text-muted-foreground">
                        {item.name}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <PinboardListButton key={item.slug} item={item} />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PinboardListButton = forwardRef<
  HTMLDivElement,
  { item: PinboardListItemButton }
>(({ item, ...rest }, ref) => {
  const { isCollapsed } = useResizable();
  const segment = useSelectedLayoutSegment();

  return (
    <div ref={ref} className="flex justify-center space-y-1" {...rest}>
      <Button
        asChild
        variant="ghost"
        className={cn(
          'w-full',
          item.slug === segment ? 'bg-accent' : '',
          isCollapsed()
            ? 'inline-flex w-auto items-center justify-center px-[10px]'
            : 'inline-block justify-start overflow-hidden overflow-ellipsis whitespace-nowrap px-4 py-2'
        )}
      >
        <Link href={item.href}>
          <span className={cn('text-base', isCollapsed() ? 'pr-0' : 'pr-1')}>
            {item.icon}
          </span>
          {!isCollapsed() && <span>{item.name}</span>}
        </Link>
      </Button>
    </div>
  );
});