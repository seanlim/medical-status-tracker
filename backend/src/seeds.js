import bcrypt from 'bcryptjs';

export async function seedM39S(db) {
  const adminUser = await db.user.findUnique({
    where: {
      username: 'm39s',
    },
  });

  if (!adminUser) {
    // create password hash
    const salt = await bcrypt.genSalt(4);
    const passwordHash = await bcrypt.hash(process.env.M39S_PASSWORD, salt);
    // insert user record
    try {
      await db.user.create({
        data: {
          username: 'm39s',
          password: passwordHash,
        },
      });
      console.info('Seeded m39s user');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create m39s user');
    }
  }

  console.info('M39s admin user set up');
}
