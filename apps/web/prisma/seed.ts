import { PrismaClient, Attribute } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const attributeConfig: Omit<
  Attribute,
  'updatedAt' | 'createdAt' | 'id' | 'organizationId' | 'icon' | 'description'
>[] = [
  {
    system: true,
    required: false,
    label: 'First Name',
    type: 'TEXT',
    config: {},
  },
  {
    system: true,
    required: false,
    label: 'Last Name',
    type: 'TEXT',
    config: {},
  },
  {
    system: true,
    required: false,
    label: 'Email Address',
    type: 'EMAIL',
    config: {},
  },
  {
    system: false,
    required: false,
    label: 'Status',
    type: 'SELECT',
    config: {
      options: [
        {
          label: 'New',
          value: 'new',
          color: 'gray',
        },
        {
          label: 'Contacted',
          value: 'contacted',
          color: 'blue',
        },
        {
          label: 'Qualified',
          value: 'qualified',
          color: 'green',
        },
        {
          label: 'Proposal Sent',
          value: 'proposal',
          color: 'yellow',
        },
        {
          label: 'Negotiation',
          value: 'negotiation',
          color: 'orange',
        },
        {
          label: 'Won',
          value: 'won',
          color: 'green',
        },
        {
          label: 'Lost',
          value: 'lost',
          color: 'red',
        },
      ],
    },
  },
];

const contacts = [
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

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: process.env.SUPABASE_TEST_USER_EMAIL as string,
    password: process.env.SUPABASE_TEST_USER_PASSWORD as string,
  });

  if (error || !data.user) {
    throw error;
  }

  const { data: bucketData, error: bucketError } =
    await supabase.storage.createBucket('org-avatars', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: '1MB',
    });

  if (bucketError || !bucketData.name) {
    throw bucketError;
  }

  const org = await prisma.organization.create({
    data: {
      slug: 'acme-inc',
      name: 'Acme Inc.',
      attributes: {
        createMany: {
          data: attributeConfig.map(a => ({
            ...a,
            config: a.config ?? {},
          })),
        },
      },
      members: {
        connect: [{ id: data.user.id }],
      },
    },
  });

  const attributes = await prisma.attribute.findMany({
    where: {
      organizationId: org.id,
    },
  });

  const attributeFirstName = attributes.find(a => a.label === 'First Name');
  const attributeLastName = attributes.find(a => a.label === 'Last Name');
  const attributeEmail = attributes.find(a => a.label === 'Email Address');
  const attributeStatus = attributes.find(a => a.label === 'Status');

  await prisma.list.create({
    data: {
      organizationId: org.id,
      slug: 'fundraising',
      name: 'Fundraising',
      icon: '💰',
      contacts: {
        create: contacts.map(contact => ({
          organizationId: org.id,
          attributes: {
            ...(attributeFirstName && {
              [attributeFirstName.id]: contact.firstName,
            }),
            ...(attributeLastName && {
              [attributeLastName.id]: contact.lastName,
            }),
            ...(attributeEmail && {
              [attributeEmail.id]: contact.email,
            }),
            ...(attributeStatus && {
              [attributeStatus.id]: contact.status,
            }),
          },
        })),
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
