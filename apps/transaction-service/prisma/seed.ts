import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const typesPromise = prisma.transactionType.createMany({
    data: [
      {
        name: 'WITHDRAWAL',
      },
      {
        name: 'TRANSFER',
      },
    ],
  });

  const statusPromise = prisma.transactionStatus.createMany({
    data: [
      {
        name: 'PENDING',
      },
      {
        name: 'APPROVED',
      },
      {
        name: 'REJECTED',
      },
    ],
  });

  const [transactionTypesCreated, transactionStatusCreated] = await Promise.all(
    [typesPromise, statusPromise],
  );

  console.log({ transactionTypesCreated, transactionStatusCreated });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
