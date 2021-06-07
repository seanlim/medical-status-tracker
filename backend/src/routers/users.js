import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import isNil from 'lodash/isNil';

import { ROLES } from '~/constants';
import { auth } from '~/middleware/auth';
import { isEmpty } from 'lodash';

const users = new Router();
users.use(bodyParser());

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

  // remove sensitive fields and return json data
  delete user.password;

  ctx.body = { data: { ...user, token } };
  ctx.status = 200;
  return;
});

users.post('/logout', async (ctx, next) => {
  ctx.cookies.set('token', null);
  ctx.body = { data: { message: 'Logged out successfully' } };
  ctx.status = 200;
  return;
});

users.get('/roles', auth(ROLES.ADMIN), async (ctx, next) => {
  ctx.type = 'application/json';
  ctx.body = { data: Object.values(ROLES) };
  ctx.status = 200;
  return;
});

users.post('/new', async (ctx, next) => {
  const { username, password, confirmPassword, name, role } = ctx.request.body;

  // Validate submission
  const submissionValues = [username, password, confirmPassword, name, role];
  if (
    !isEmpty(submissionValues.filter(isNil)) ||
    !isEmpty(submissionValues.filter(isEmpty)) ||
    !ROLES.includes(role)
  ) {
    ctx.body = { error: { message: 'Invalid request.' } };
    ctx.status = 400;
    return;
  }
  if (password !== confirmPassword) {
    ctx.body = { error: { message: 'Passwords do not match.' } };
    ctx.status = 400;
    return;
  }

  // create user
  console.info('Creating new user...');
  // create password hash
  const salt = await bcrypt.genSalt(4);
  const passwordHash = await bcrypt.hash(password, salt);
  // insert user record
  try {
    await db.user.create({
      data: {
        username,
        password: passwordHash,
        role,
        name,
      },
    });
    console.info('✅ Created new user');
  } catch (error) {
    console.error(error);
  }
});

module.exports = users;
