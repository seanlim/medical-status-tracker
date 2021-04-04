import Koa from 'koa';
import dotenv from 'dotenv';
dotenv.config();

import { users, medicalStatus, publik } from './routers';
import { seedM39S } from './seeds';

const app = new Koa();

// seed m39s application user
seedM39S();

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(medicalStatus.routes())
    .use(users.routes())
    .use(publik.routes())
    .use(medicalStatus.allowedMethods())
    .use(users.allowedMethods())
    .use(publik.allowedMethods());

app.listen(process.env.PORT);

console.info(`Server running on port ${process.env.PORT}`);
