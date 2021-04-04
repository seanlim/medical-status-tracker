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

// test endpoint
publik.get('/hello', async (ctx, next) => {
    ctx.status = 200;
    ctx.message = 'world';
    return;
});

// authenticates a user
users.post('/login', async (ctx, next) => {
    // get db and cookies from req state
    const db = ctx.db;
    // extract params
    const { username, password } = ctx.request.body;
    // query against user email
    const user = await db('User').where({ username }).first();
    if (!user) {
        ctx.body = { error: { message: 'Invalid username or password.' } };
        ctx.status = 401;
        return;
    }
    //  authenticate password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
        ctx.body = { error: { message: 'Invalid username or password.' } };
        ctx.status = 401;
        return;
    }
    // create, sign, and set jwt
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    ctx.cookies.set('token', token);
    // remove sensitive fields and return json data
    delete user.password;

    ctx.body = { data: user };
    ctx.status = 200;
    return;
});

// fetches medical statuses from tracking Sheets document
medicalStatus.get('/medical-statuses', async (ctx, next) => {
    const data = await fetchMedicalStatuses();
    delete data.undefined;
    delete data[''];
    ctx.type = 'application/json';
    ctx.status = 200;
    ctx.body = data;
    return;
});
