import knex from 'knex';
import bcrypt from 'bcryptjs';

export async function seedM39S() {
    const db = knex({
        client: 'postgres',
        connection: process.env.DATABASE_URL,
    });
    const adminUser = await db('User').where({ username: 'm39s' }).first();
    if (!adminUser) {
        // create password hash
        const salt = await bcrypt.genSalt(4);
        const passwordHash = await bcrypt.hash(process.env.M39S_PASSWORD, salt);
        // insert user record
        let user;
        try {
            [user] = await db('User')
                .insert({
                    username: 'm39s',
                    password: passwordHash,
                })
                .returning('*');
            console.info('Seeded m39s user');
        } catch (error) {
            console.error(error);
            throw new Error('Failed to create m39s user');
        }
    }

    console.info('M39s admin user set up');
}
