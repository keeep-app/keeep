'use client';

import { selectConfigSchema } from '@/lib/schemas/data-column';
import { CustomerAttributes } from '@/lib/types/data-columns';
import { cn } from '@/lib/utils';
import { Attribute } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

const colorConfig = {
  gray: 'bg-gray-100 text-gray-900',
  blue: 'bg-blue-100 text-blue-900',
  green: 'bg-green-100 text-green-900',
  yellow: 'bg-yellow-100 text-yellow-900',
  orange: 'bg-orange-100 text-orange-900',
  red: 'bg-red-100 text-red-900',
};

export const getContactColumns = (
  attributeConfig: Attribute[]
): ColumnDef<CustomerAttributes>[] => {
  let columns: ColumnDef<CustomerAttributes>[] = [];

  const firstNameAttribute = attributeConfig.find(
    attribute => attribute.label === 'First Name'
  );
  const lastNameAttribute = attributeConfig.find(
    attribute => attribute.label === 'Last Name'
  );

  if (firstNameAttribute && lastNameAttribute) {
    columns.push({
      id: 'full_name',
      header: 'Name',
      accessorFn: row => {
        return `${row[firstNameAttribute.id]} ${row[lastNameAttribute.id]}`;
      },
    });
  }

  attributeConfig.forEach(attribute => {
    if (attribute.label === 'First Name' || attribute.label === 'Last Name')
      return;

    switch (attribute.type) {
      case 'SELECT': {
        columns.push({
          id: attribute.id.toString(),
          header: attribute.label,
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
                  'rounded-full px-3 py-1.5',
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
          header: attribute.label,
          cell: ({ row }) => {
            return row.original[attribute.id];
          },
        });
        break;
      }
      default: {
        columns.push({
          id: attribute.id.toString(),
          header: attribute.label,
          cell: ({ row }) => {
            return row.original[attribute.id];
          },
        });
      }
    }
  });
  return columns;
};
