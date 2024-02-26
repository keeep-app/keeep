'use client';

import { Button } from '@/components/ui/button';
import { selectConfigSchema } from '@/lib/schemas/data-column';
import { CustomerAttributes } from '@/lib/types/data-columns';
import { cn } from '@/lib/utils';
import { Attribute } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ColumnDef, Table } from '@tanstack/react-table';
import { Download, MoreHorizontal, Trash } from 'lucide-react';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Checkbox } from '@/components/ui/checkbox';

const colorConfig = {
  gray: 'bg-gray-100 text-gray-900',
  blue: 'bg-blue-100 text-blue-900',
  green: 'bg-green-100 text-green-900',
  yellow: 'bg-yellow-100 text-yellow-900',
  orange: 'bg-orange-100 text-orange-900',
  red: 'bg-red-100 text-red-900',
};

export type TableProps = {
  id: string;
} & CustomerAttributes;

export const getContactColumns = (
  attributeConfig: Attribute[],
  deleteContacts: (_: Table<TableProps>) => void
): ColumnDef<TableProps>[] => {
  let columns: ColumnDef<TableProps>[] = [];

  columns.push({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  });

  const firstNameAttribute = attributeConfig.find(
    attribute => attribute.internalSlug === 'first-name'
  );
  const lastNameAttribute = attributeConfig.find(
    attribute => attribute.internalSlug === 'last-name'
  );

  if (firstNameAttribute && lastNameAttribute) {
    columns.push({
      id: 'full_name',
      meta: { columnHeaderLabel: 'Name' },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="Name" />;
      },
      accessorFn: row => {
        return `${row[firstNameAttribute.id]} ${row[lastNameAttribute.id]}`;
      },
    });
  }

  attributeConfig.forEach(attribute => {
    if (
      attribute.internalSlug === 'first-name' ||
      attribute.internalSlug === 'last-name'
    )
      return;

    switch (attribute.type) {
      case 'SELECT': {
        columns.push({
          id: attribute.id.toString(),
          header: ({ column }) => {
            return (
              <DataTableColumnHeader column={column} title={attribute.label} />
            );
          },
          meta: { columnHeaderLabel: attribute.label },
          cell: ({ row }) => {
            const parseResult = selectConfigSchema.safeParse(attribute.config);
            if (!parseResult.success) return;
            const options = parseResult.data.options;
            const selectedOption = options.find(
              option => option.value === row.original[attribute.id]
            );
            if (!selectedOption) return;

            return (
              <span
                className={cn(
                  'inline-block max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap rounded-full px-3 py-1.5',
                  colorConfig[selectedOption.color as keyof typeof colorConfig]
                )}
              >
                {selectedOption.label}
              </span>
            );
          },
        });
        break;
      }
      case 'TEXT':
      case 'EMAIL': {
        columns.push({
          id: attribute.id.toString(),
          meta: { columnHeaderLabel: attribute.label },
          header: ({ column }) => {
            return (
              <DataTableColumnHeader column={column} title={attribute.label} />
            );
          },
          accessorFn: row => {
            return row[attribute.id];
          },
        });
        break;
      }
      default: {
        columns.push({
          id: attribute.id.toString(),
          meta: { columnHeaderLabel: attribute.label },
          header: ({ column }) => {
            return (
              <DataTableColumnHeader column={column} title={attribute.label} />
            );
          },
          accessorFn: row => {
            return row[attribute.id];
          },
        });
      }
    }
  });

  columns.push({
    id: 'actions',
    header: ({ table }) => {
      return (
        <div
          className={cn({
            hidden: !table.getFilteredSelectedRowModel().rows.length,
          })}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled>
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => deleteContacts(table)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const emailId = attributeConfig.find(
        attribute => attribute.internalSlug === 'email'
      )?.id;

      const email = emailId && row.original[emailId];
      const isAnyRowSelected =
        !!table.getFilteredSelectedRowModel().rows.length;

      if (!email || typeof email !== 'string') return null;

      return (
        <div
          className={cn({
            'opacity-0': isAnyRowSelected,
          })}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isAnyRowSelected}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(email)}
              >
                Copy email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableHiding: false,
    enableSorting: false,
  });
  return columns;
};
