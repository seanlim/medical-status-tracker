import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { fetchMedicalStatuses } from './sheetsAPI';
import { auth } from './middleware/auth';

export const publik = new Router();
export const medicalStatus = new Router();
export const users = new Router();

medicalStatus.use(auth()).use(bodyParser());
users.use(bodyParser());

// test endpoint
publik.get('/hello', async (ctx, next) => {
    ctx.status = 200;
    ctx.message = 'world';
    return;
});

// authenticates a user
users.post('/login', async (ctx, next) => {
    // extract params
    const { username, password } = ctx.request.body;
    // query against user email
    const user = await ctx.db.user.findUnique({
        where: {
            username,
        },
    });
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

users.post('/logout', async (ctx, next) => {
    ctx.cookies.set('token', null);
    ctx.body = { data: { message: 'Logged out successfully' } };
    ctx.status = 200;
    return;
});

// fetches medical statuses from tracking Sheets document
medicalStatus.get('/medical-statuses', async (ctx, next) => {
    const medicalStatuses = await fetchMedicalStatuses();
    delete medicalStatuses.undefined;
    delete medicalStatuses[''];
    ctx.type = 'application/json';
    ctx.status = 200;
    ctx.body = { data: medicalStatuses };
    return;
});
