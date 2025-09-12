import { PrismaClient } from '@prisma/client';
import { hash as hashSync } from 'argon2';

import { permissionData, permissionTo } from './data/permissions';
import { menuItems, profileMenuItems } from './data/menu-items';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.permission.createMany({
    data: permissionData,
  });

  await prisma.profile.create({
    data: {
      name: 'Gerente de Sistemas',
      Permissions: {
        connect: [...permissionTo.all],
      },
    },
  });

  console.log(`Profiles seeding finished.`);

  await prisma.user.create({
    data: {
      email: process.env.LOGIN_EMAIL || 'default@admin.com',
      password: await hashSync(
        process.env.LOGIN_PASSWORD || 'defaultPassword1!',
      ),
      roles: 'admin',
      name: 'SysAdmin',
      profileId: 1,
    },
  });

  console.log(`User seeding finished.`);

  await prisma.menuItems.createMany({
    data: menuItems,
  });

  console.log(`Menu items seeding finished.`);

  await prisma.profileMenuItems.createMany({
    data: profileMenuItems,
  });

  console.log(`Profile menu items seeding finished.`);
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
