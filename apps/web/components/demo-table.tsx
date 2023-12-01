import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const labelConfig = {
  status: 'Status',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
};

const statusConfig = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal Sent',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

const colorConfig = {
  new: 'bg-gray-100 text-gray-900',
  contacted: 'bg-blue-100 text-blue-900',
  qualified: 'bg-green-100 text-green-900',
  proposal: 'bg-yellow-100 text-yellow-900',
  negotiation: 'bg-orange-100 text-orange-900',
  won: 'bg-green-100 text-green-900',
  lost: 'bg-red-100 text-red-900',
};

type Contact = {
  status: keyof typeof statusConfig;
  email: string;
  firstName: string;
  lastName: string;
};

const contacts: Contact[] = [
  {
    status: 'new',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    status: 'contacted',
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
  },
  {
    status: 'qualified',
    email: 'bob.smith@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
  },
  {
    status: 'proposal',
    email: 'alice.jones@example.com',
    firstName: 'Alice',
    lastName: 'Jones',
  },
  {
    status: 'negotiation',
    email: 'charlie.brown@example.com',
    firstName: 'Charlie',
    lastName: 'Brown',
  },
  {
    status: 'won',
    email: 'david.johnson@example.com',
    firstName: 'David',
    lastName: 'Johnson',
  },
  {
    status: 'lost',
    email: 'emily.williams@example.com',
    firstName: 'Emily',
    lastName: 'Williams',
  },
  {
    status: 'new',
    email: 'frank.thomas@example.com',
    firstName: 'Frank',
    lastName: 'Thomas',
  },
  {
    status: 'contacted',
    email: 'grace.martin@example.com',
    firstName: 'Grace',
    lastName: 'Martin',
  },
  {
    status: 'qualified',
    email: 'harry.edwards@example.com',
    firstName: 'Harry',
    lastName: 'Edwards',
  },
];

export function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{labelConfig['status']}</TableHead>
          <TableHead>{labelConfig['firstName']}</TableHead>
          <TableHead>{labelConfig['lastName']}</TableHead>
          <TableHead>{labelConfig['email']}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map(contact => (
          <TableRow key={contact.email}>
            <TableCell>
              <div
                className={cn(
                  colorConfig[contact.status],
                  'w-fit rounded-xl px-2 py-1 text-xs'
                )}
              >
                {statusConfig[contact.status]}
              </div>
            </TableCell>
            <TableCell>{contact.firstName}</TableCell>
            <TableCell>{contact.lastName}</TableCell>
            <TableCell>{contact.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
