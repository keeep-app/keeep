'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { useSelectedLayoutSegment } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

type PinboardListsProps = {
  sections: {
    title: string;
    count: number;
    items: {
      icon: React.ReactNode;
      name: string;
      href: string;
      slug: string;
    }[];
  }[];
};

export function PinboardLists({ sections }: PinboardListsProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        {sections.map(section => {
          return (
            <div key={section.title}>
              <h2 className="font-accent mb-4 flex items-center justify-between text-lg font-semibold">
                {section.title}
                <Badge variant="accent" tabular="numeric">
                  {section.count}
                </Badge>
              </h2>
              {section.items.map(item => {
                return (
                  <div key={item.name} className="space-y-1">
                    <Button
                      asChild
                      variant="ghost"
                      className={cn(
                        'w-full justify-start',
                        item.slug === segment ? 'bg-accent' : ''
                      )}
                    >
                      <Link href={item.href}>
                        {item.icon}
                        {item.name}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
