const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'adminpassword',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Created admin user:', admin);

  const stats = await prisma.stats.upsert({
    where: { id: 'global-stats' },
    update: {},
    create: {
      id: 'global-stats',
      totalTeams: 0,
      totalMembers: 0,
    },
  });
  console.log('Created initial stats:', stats);
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
