'use client';

import { DataTable } from '@/components/data-table/data-table';
import { Attribute, Contact } from '@prisma/client';
import { getContactColumns } from './columns';
import { CustomerAttributes } from '@/lib/types/data-columns';
import { HeaderActions } from './header-actions';

type ContactTableProps = {
  contacts: Contact[];
  attributes: Attribute[];
};

export const ContactTable = ({ contacts, attributes }: ContactTableProps) => {
  const columns = getContactColumns(attributes);

  return (
    <DataTable
      columns={columns}
      data={contacts.map(contact => {
        return contact.attributes as CustomerAttributes;
      })}
      withPagination
      withColumnToggle
      additionalHeaderActions={HeaderActions()}
    />
  );
};
