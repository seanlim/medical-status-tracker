import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { fetchMedicalStatuses } from './sheetsAPI';
import db from './middleware/db';
import { auth } from './middleware/auth';

export const publik = new Router();
export const medicalStatus = new Router();
export const users = new Router();

medicalStatus.use(db()).use(auth()).use(bodyParser());
users.use(db()).use(bodyParser());

publik.get('/hello', async (ctx, next) => {
    ctx.status = 200;
    ctx.message = 'world';
    return;
});

users.post('/login', async (ctx, next) => {
    console.info(ctx.request.body);
    return;
});

medicalStatus.get('/medical-statuses', async (ctx, next) => {
    const data = await fetchMedicalStatuses();
    delete data.undefined;
    delete data[''];
    ctx.type = 'application/json';
    ctx.status = 200;
    ctx.body = data;
    return;
});
