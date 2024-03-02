'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { useResizable } from './sidebar-resizable';
import { forwardRef, useState } from 'react';
import { MoreHorizontal, PlusIcon } from 'lucide-react';
import { createList, deleteList, updateList } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Command,
  CommandSeparator,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
        {isCollapsed() ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" className="w-full">
                Create new list
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              <span className="ml-auto text-muted-foreground">
                Create new list
              </span>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            size="xs"
            variant="ghost"
            className="flex w-full items-center justify-start gap-1"
            onClick={() => createList()}
          >
            <PlusIcon className="h-4 w-4" />
            New list
          </Button>
        )}
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
  const [listName, setListName] = useState(item.name);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const { toast } = useToast();

  const updateListEntry = async () => {
    const { error } = await updateList(item.slug, listName);
    if (error) {
      toast({
        title: "Couldn't update list",
        description:
          'An error occurred while updating the name. Please try again later.',
      });
    } else {
      setPopoverOpen(false);
    }
  };

  const duplicateListEntry = async () => {
    const { error } = await createList(listName);
    if (error) {
      toast({
        title: "Couldn't duplicate list",
        description:
          'An error occurred while duplicating the list. Please try again later.',
      });
    } else {
      setPopoverOpen(false);
    }
  };

  const deleteListEntry = async () => {
    const { error } = await deleteList(item.slug);
    if (error) {
      toast({
        title: "Couldn't delete list",
        description:
          'An error occurred while deleting the list. Please try again later.',
      });
    } else {
      setPopoverOpen(false);
    }
  };

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
        <div className="flex w-full items-center justify-between">
          <Link href={item.href}>
            <span className={cn('text-base', isCollapsed() ? 'pr-0' : 'pr-2')}>
              {item.icon}
            </span>
            {!isCollapsed() && <span>{item.name}</span>}
          </Link>
          <DropdownMenu open={popoverOpen} onOpenChange={setPopoverOpen}>
            <DropdownMenuTrigger>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
              <Command>
                <CommandGroup>
                  <CommandItem>
                    <Input
                      className="h-8"
                      value={listName}
                      onChange={event => setListName(event.target.value)}
                      onKeyDown={async event => {
                        if (event.code === 'Enter') {
                          event.preventDefault();
                          updateListEntry();
                        }
                      }}
                    />
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <DropdownMenuItem>Mark as favorite</DropdownMenuItem>
                  <DropdownMenuItem onClick={duplicateListEntry}>
                    Duplicate
                  </DropdownMenuItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setAlertDialogOpen(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </CommandGroup>
              </Command>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  You want to delete list: "{item.name}"?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Are you sure you want to delete this list? This action will not
                remove any contacts from the list.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteListEntry}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Button>
    </div>
  );
});
