import Router from '@koa/router';

export const publik = new Router();

publik.get('/hello', async (ctx, next) => {
  ctx.status = 200;
  ctx.message = 'world';
  return;
});
