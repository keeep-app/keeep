'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { useResizable } from './sidebar-resizable';
import { forwardRef, useState } from 'react';
import { MoreHorizontal, PlusIcon, SaveIcon } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import EmojiPicker from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type PinboardListItemButton = {
  icon: React.ReactNode;
  name: string;
  href: string;
  slug: string;
};

type PinboardListsProps = {
  title: string;
  count: number;
  sections: {
    title: string;
    items: PinboardListItemButton[];
  }[];
};

export function PinboardLists({ title, count, sections }: PinboardListsProps) {
  const { isCollapsed } = useResizable();

  return (
    <div className="pb-12">
      <div className={cn('space-y-1.5 p-4', isCollapsed() ? 'px-1' : '')}>
        {!isCollapsed() && (
          <h2 className="mb-4 flex items-center justify-between font-accent text-lg font-semibold">
            {title}
            <Badge variant="accent" tabular="numeric">
              {count}
            </Badge>
          </h2>
        )}
        <div className="flex flex-col gap-2">
          {sections.map(section => {
            return (
              <div key={section.title}>
                {!isCollapsed() && (
                  <h3 className="mb-1 flex items-center justify-between font-accent text-sm font-semibold">
                    {section.title}
                  </h3>
                )}
                <div className="flex flex-col gap-0.5">
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
              </div>
            );
          })}
        </div>
        {isCollapsed() ? (
          <div className="px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="inline-flex w-auto items-center justify-center px-[10px] "
                  onClick={() => createList()}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                <span className="ml-auto text-muted-foreground">
                  Create new list
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-1 overflow-hidden overflow-ellipsis whitespace-nowrap pl-1"
            onClick={() => createList()}
          >
            <span>
              <PlusIcon className="h-5 w-5" />
            </span>
            <span>New list</span>
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
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);
  const { toast } = useToast();

  const updateListEntry = async (updateData: {
    name?: string;
    favorite?: boolean;
    icon?: string;
  }) => {
    const { error } = await updateList(item.slug, updateData);
    if (error) {
      toast({
        title: "Couldn't update list",
        description:
          'An error occurred while updating the name. Please try again later.',
      });
    } else {
      setPopoverOpen(false);
      setEmojiPopoverOpen(false);
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
    <div
      ref={ref}
      className="group/item flex justify-center space-y-1"
      {...rest}
    >
      <Button
        asChild
        variant="ghost"
        className={cn(
          'w-full',
          item.slug === segment ? 'bg-accent' : '',
          isCollapsed()
            ? 'flex w-auto items-center justify-center px-[10px]'
            : 'inline-block justify-start overflow-hidden overflow-ellipsis whitespace-nowrap px-4 py-2'
        )}
      >
        <div className="flex w-auto flex-row items-center justify-between">
          <Popover open={emojiPopoverOpen} onOpenChange={setEmojiPopoverOpen}>
            <PopoverTrigger disabled={isCollapsed()}>
              <span
                className={cn(
                  'rounded-md p-1 text-center text-base',
                  isCollapsed() ? 'mr-0' : 'mr-1.5 hover:bg-[#dfdfe2]'
                )}
              >
                {item.icon}
              </span>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-fit">
              <EmojiPicker
                style={{ border: 'none' }}
                onEmojiClick={async obj => {
                  await updateListEntry({ icon: obj.emoji });
                }}
              />
            </PopoverContent>
          </Popover>
          <Link href={item.href} className="flex-1">
            {!isCollapsed() && (
              <span className="block max-w-[110px] flex-1 overflow-hidden text-ellipsis group-hover/item:w-[80px]">
                {item.name}
              </span>
            )}
          </Link>

          <DropdownMenu open={popoverOpen} onOpenChange={setPopoverOpen}>
            <DropdownMenuTrigger
              className={cn('invisible', {
                'rounded-md p-1 hover:bg-[#dfdfe2] group-hover/item:visible':
                  !isCollapsed(),
                'hidden w-0': isCollapsed(),
              })}
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
              <Command>
                <CommandGroup>
                  <CommandItem>
                    <div className="flex flex-row items-center gap-2">
                      <Input
                        className="h-8"
                        value={listName}
                        onChange={event => setListName(event.target.value)}
                        onKeyDown={async event => {
                          if (event.code === 'Enter') {
                            event.preventDefault();
                            updateListEntry({ name: listName });
                          }
                        }}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="xs"
                            disabled={listName === item.name}
                            onClick={() => {
                              updateListEntry({ name: listName });
                            }}
                          >
                            <SaveIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Save name changes
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={() => updateListEntry({ favorite: true })}
                  >
                    Mark as favorite
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:cursor-pointer"
                    onClick={duplicateListEntry}
                  >
                    Duplicate
                  </DropdownMenuItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <DropdownMenuItem
                    className="text-destructive hover:cursor-pointer"
                    onClick={() => setAlertDialogOpen(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </CommandGroup>
              </Command>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Button>
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
  );
});
