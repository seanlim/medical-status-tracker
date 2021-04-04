import knex from 'knex';

export default function db() {
    return async (ctx, next) => {
        ctx.db = knex({
            client: 'postgres',
            connection: process.env.DATABASE_URL,
        });
        await next();

        // somehow this event watcher is being instantly called.

        // ctx.res.on('finish', () => {
        //     db.destroy();
        // });
    };
}
