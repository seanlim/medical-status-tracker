import knex from "knex";

export default function db() {
    return async (ctx, next) => {
        const db = knex({
            client: "postgres",
            connection: process.env.DATABASE_URL,
        });

        ctx.db = db;
        next();

        ctx.res.on("finish", () => {
            db.destroy();
        });
    };
}