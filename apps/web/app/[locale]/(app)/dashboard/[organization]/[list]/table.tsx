'use client';

import { DataTable } from '@/components/data-table/data-table';
import { Attribute, Contact } from '@prisma/client';
import { TableProps, getContactColumns } from './columns';
import { CustomerAttributes } from '@/lib/types/data-columns';
import { HeaderActions } from './header-actions';
import { useToast } from '@/components/ui/use-toast';
import { Table } from '@tanstack/react-table';
import { deleteContacts } from '@/app/actions';

type ContactTableProps = {
  contacts: Contact[];
  attributes: Attribute[];
  organization: string;
  list: string;
};

export const ContactTable = ({
  contacts,
  attributes,
  organization,
  list,
}: ContactTableProps) => {
  const { toast } = useToast();

  const deleteSelectedContacts = async (table: Table<TableProps>) => {
    // get all selected contacts
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const contactIds = selectedRows.map(row => row.original.id);

    const { error, data } = await deleteContacts(
      contactIds,
      organization,
      list
    );

    if (!error) {
      toast({
        title: 'Contacts deleted',
        description: `${data.count} contacts were successfully deleted`,
      });
      table.resetRowSelection();
      return;
    }

    toast({
      title: 'Error',
      description: 'There was an error deleting the contacts',
    });
  };

  const columns = getContactColumns(attributes, deleteSelectedContacts);

  return (
    <DataTable
      columns={columns}
      data={contacts.map(contact => {
        return {
          ...(contact.attributes as CustomerAttributes),
          id: contact.externalId,
        } as TableProps;
      })}
      withPagination
      withColumnToggle
      additionalHeaderActions={
        <HeaderActions organization={organization} list={list} />
      }
    />
  );
};
