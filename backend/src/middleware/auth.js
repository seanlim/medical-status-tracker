import jwt from 'jsonwebtoken';

export function auth(role) {
  return async (ctx, next) => {
    const token = ctx.request.token;
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

    const user = await ctx.db.user.findUnique({
      where: {
        id,
      },
    });
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

    if (user.role !== role) {
      ctx.status = 403;
      ctx.body = {
        error: {
          message: 'Unauthorized',
        },
      };
      return;
    }

    await next();
  };
}
