'use client';

import { useState } from 'react';
import { Organization } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { Check, ChevronDown, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useSupabase } from '@/lib/provider/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  organizations: Organization[];
  current: Organization;
}

export default function OrganizationSwitcher({
  className,
  organizations,
  current,
}: TeamSwitcherProps) {
  const t = useTranslations('Sidebar.organization');
  const { user } = useSupabase();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Organization | undefined>(
    organizations.find(org => org.id === current.id)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label={t('select-organization')}
          className={cn(
            'flex h-full w-full items-center justify-start rounded-none border-b border-gray-100',
            className
          )}
        >
          {selected ? (
            <OrganizationDetails org={selected} />
          ) : (
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          )}
          {selected && <ChevronDown className="ml-2 h-5 w-5" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          {user && (
            <CommandItem disabled className="py-2 text-xs opacity-50">
              {t('logged-in-as')} {user.email}
            </CommandItem>
          )}
          <CommandList>
            <CommandGroup heading="Organizations">
              {organizations.map(org => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    setSelected(org);
                    setOpen(false);
                  }}
                >
                  <OrganizationDetails
                    org={org}
                    selected={org.id === selected?.id}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandList>
            <CommandGroup>
              <CommandItem disabled className="text-xs opacity-50">
                <Plus className="mr-2 h-5 w-5" />
                {t('create-organization')}{' '}
                <span className="pl-1 text-[0.6rem]">(${t('soon')})</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function OrganizationDetails({
  org,
  selected,
}: {
  org: Organization;
  selected?: boolean;
}) {
  return (
    <>
      <Avatar className="mr-3 h-7 w-7">
        <AvatarImage src={org.logo ?? undefined} alt={org.name} />
        <AvatarFallback>
          {org.name.substring(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="mr-2 inline-flex w-full items-center justify-between text-base">
        {org.name} {selected && <Check className="h-4 w-4" />}
      </span>
    </>
  );
}
