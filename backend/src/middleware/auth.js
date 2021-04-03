import jwt from 'jsonwebtoken';

export function auth() {
    return async (ctx, next) => {
        const db = ctx.db;
        const token = ctx.cookies.get('token');
        if (!token) {
            ctx.status = 401;
            ctx.body = {
                error: {
                    message: 'You are not authenticated',
                },
            };
            return;
        }

        let id;
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            id = payload.id;
        } catch {
            ctx.status = 401;
            ctx.body = {
                error: {
                    message: 'You are not authenticated',
                },
            };
            return;
        }

        if (db) {
            const user = await db('users').where({ id }).first();
            if (!user) {
                ctx.status = 401;
                ctx.body = {
                    error: {
                        message: 'You are not authenticated',
                    },
                };
                return;
            }

            ctx.user = user;
        }

        next();
    };
}
