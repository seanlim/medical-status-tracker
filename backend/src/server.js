import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import bearerToken from 'koa-bearer-token';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import credentials from '~/middleware/credentials';
import { users, medicalStatus, publik } from '~/routers';
import { seedM39S } from '~/seeds';
import { createGoogleSheetsClient } from '~/sheetsAPI';

dotenv.config();

async function main() {
  const app = new Koa();
  app.proxy = true;

  app.context.db = new PrismaClient();
  app.context.sheets = await createGoogleSheetsClient();

  // seed m39s application user
  seedM39S(app.context.db);

  // cors, headers
  app.use(credentials());
  if (process.env.FRONTEND_ORIGIN === 'localhost') {
    app.use(cors());
  } else {
    app.use(
      cors({
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true,
      })
    );
  }
  app.use(bodyParser());
  app.use(bearerToken());

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

  app
    .use(medicalStatus.routes(), medicalStatus.allowedMethods())
    .use(users.routes(), users.allowedMethods())
    .use(publik.routes(), publik.allowedMethods());

  app.listen(process.env.PORT);

  console.info(users.stack.map((i) => i.path));
  console.info(publik.stack.map((i) => i.path));
  console.info(medicalStatus.stack.map((i) => i.path));

  console.info(`Server running on port ${process.env.PORT}`);
}

main();
