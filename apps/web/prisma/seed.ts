import { PrismaClient, AttributeType } from '@prisma/client';

const prisma = new PrismaClient();

const systemAttributes: {
  label: string;
  type: AttributeType;
  icon?: string;
}[] = [
  {
    label: 'Profile Picture',
    type: 'TEXT',
  },
  {
    label: 'First Name',
    type: 'TEXT',
  },
  {
    label: 'Last Name',
    type: 'TEXT',
  },
  {
    label: 'Email Address',
    type: 'EMAIL',
  },
];

async function main() {
  const org = await prisma.organization.create({
    data: {
      slug: 'keeep',
      name: 'keeep',
      attributes: {
        createMany: {
          data: systemAttributes.map(a => ({ ...a, system: true })),
        },
      },
      users: {
        create: [
          {
            email: 'user@example.com',
            firstName: 'Test',
            lastName: 'User',
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

  await prisma.list.create({
    data: {
      organizationId: org.id,
      slug: 'my-list',
      name: 'My List',
      contacts: {
        create: [
          {
            externalId: '1',
            organizationId: org.id,
            attributes: {
              ...(attributeFirstName && { [attributeFirstName.id]: 'John' }),
              ...(attributeLastName && { [attributeLastName.id]: 'Doe' }),
              ...(attributeEmail && {
                [attributeEmail.id]: 'john.doe@example.com',
              }),
            },
            companies: {
              create: [
                {
                  slug: 'apple',
                  name: 'Apple',
                  organizationId: org.id,
                },
              ],
            },
          },
        ],
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
