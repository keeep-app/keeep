import { PrismaClient, Attribute } from '@prisma/client';

const prisma = new PrismaClient();

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
    externalId: '1',
    status: 'new',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    externalId: '2',
    status: 'contacted',
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
  },
  {
    externalId: '3',
    status: 'qualified',
    email: 'bob.smith@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
  },
  {
    externalId: '4',
    status: 'proposal',
    email: 'alice.jones@example.com',
    firstName: 'Alice',
    lastName: 'Jones',
  },
  {
    externalId: '5',
    status: 'negotiation',
    email: 'charlie.brown@example.com',
    firstName: 'Charlie',
    lastName: 'Brown',
  },
  {
    externalId: '6',
    status: 'won',
    email: 'david.johnson@example.com',
    firstName: 'David',
    lastName: 'Johnson',
  },
  {
    externalId: '7',
    status: 'lost',
    email: 'emily.williams@example.com',
    firstName: 'Emily',
    lastName: 'Williams',
  },
  {
    externalId: '8',
    status: 'new',
    email: 'frank.thomas@example.com',
    firstName: 'Frank',
    lastName: 'Thomas',
  },
  {
    externalId: '9',
    status: 'contacted',
    email: 'grace.martin@example.com',
    firstName: 'Grace',
    lastName: 'Martin',
  },
  {
    externalId: '10',
    status: 'qualified',
    email: 'harry.edwards@example.com',
    firstName: 'Harry',
    lastName: 'Edwards',
  },
];

async function main() {
  const org = await prisma.organization.create({
    data: {
      slug: 'keeep',
      name: 'keeep',
      attributes: {
        createMany: {
          data: attributeConfig.map(a => ({
            ...a,
            config: a.config ?? {},
          })),
        },
      },
      users: {
        create: [
          {
            email: 'dummy@keeep.app',
            firstName: 'Bobby',
            lastName: 'Crown',
          },
        ],
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
      slug: 'my-list',
      name: 'My List',
      contacts: {
        create: contacts.map(contact => ({
          externalId: contact.externalId,
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
