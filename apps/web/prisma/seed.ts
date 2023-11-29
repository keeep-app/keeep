import { PrismaClient, AttributeType } from '@prisma/client';

const prisma = new PrismaClient();

const systemAttributes: {
  label: string;
  type: AttributeType;
  icon?: string;
}[] = [
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
    },
  });

  const orgConfig = await prisma.organizationConfig.create({
    data: {
      organizationId: org.id,
      attributes: {
        createMany: {
          data: systemAttributes.map(a => ({ ...a, system: true })),
        },
      },
    },
  });

  const attributeConfigs = await prisma.attributeConfig.findMany({
    where: {
      organizationId: orgConfig.organizationId,
    },
  });

  const attributeFirstName = attributeConfigs.find(
    a => a.label === 'First Name'
  );
  const attributeLastName = attributeConfigs.find(a => a.label === 'Last Name');
  const attributeEmail = attributeConfigs.find(
    a => a.label === 'Email Address'
  );

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
