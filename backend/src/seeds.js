import bcrypt from 'bcryptjs';

import { ROLES } from '~/constants';

export async function seedM39S(db) {
  const adminUser = await db.user.findUnique({
    where: {
      username: 'admin',
    },
  });

  if (!adminUser) {
    console.info('Admin user not set up, seeding...');
    // create password hash
    const salt = await bcrypt.genSalt(4);
    const passwordHash = await bcrypt.hash(process.env.M39S_PASSWORD, salt);
    // insert user record
    try {
      await db.user.create({
        data: {
          username: 'admin',
          password: passwordHash,
          role: ROLES.ADMIN,
          name: 'Admin Account',
        },
      });
      console.info('✅ Seeded admin user');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create admin user');
    }
  }

  console.info('✅ Admin user is present');
}
