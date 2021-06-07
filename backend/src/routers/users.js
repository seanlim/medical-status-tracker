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

users.delete('/delete-user', auth(ROLES.ADMIN), async (ctx, next) => {
  const { db, user } = ctx;
  const { id } = ctx.request.body;

  // cannot delete self
  if (id === user.id) {
    ctx.body = { error: { message: "You can't delete yourself!" } };
    ctx.status = 400;
    return;
  }

  let userDelete;
  try {
    userDelete = await db.user.findUnique({ where: { id } });
    if (!userDelete) throw new Error();
  } catch (error) {
    console.error(error);
    ctx.body = {
      error: {
        message:
          "An error has occured while deleting the user. Either the user doesn't exist, or the user has already been deleted.",
      },
    };
    ctx.status = 500;
    return;
  }

  // cannot delete genesis admin accout
  if (userDelete.username === 'admin') {
    ctx.body = { error: { message: "You can't delete the admin" } };
    ctx.status = 400;
    return;
  }

  try {
    await db.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(error);
    ctx.body = {
      error: {
        message:
          "An error has occured while deleting the user. Either the user doesn't exist, or the user has already been deleted.",
      },
    };
    ctx.status = 500;
    return;
  }

  ctx.body = { data: { message: 'success!' } };
  ctx.status = 200;
  return;
});

users.get('/users', auth(ROLES.ADMIN), async (ctx, next) => {
  const { db, user } = ctx;
  let users = await db.user.findMany({
    select: {
      name: true,
      id: true,
      role: true,
    },
  });

  ctx.type = 'application/json';
  ctx.body = { data: users };
  ctx.status = 200;
  return;
});

users.post('/create-user', auth(ROLES.ADMIN), async (ctx, next) => {
  const { db } = ctx;
  const { username, password, confirmPassword, name, role } = ctx.request.body;

  // Validate submission
  const submissionValues = [username, password, confirmPassword, name, role];
  if (
    !isEmpty(submissionValues.filter(isNil)) ||
    !isEmpty(submissionValues.filter(isEmpty)) ||
    !Object.values(ROLES).includes(role)
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
  } catch (error) {
    console.error(error);
    ctx.body = {
      error: {
        message:
          'An error occured while creating a new user. Try using another username, else please contact the developer.',
      },
    };
    ctx.status = 500;
    return;
  }

  ctx.body = { data: { message: 'success!' } };
  ctx.status = 200;
  return;
});

module.exports = users;
