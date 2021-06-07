import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { fetchMedicalStatuses } from '~/sheetsAPI';
import { ROLES } from '~/constants';
import { auth } from '~/middleware/auth';

export const medicalStatus = new Router();

medicalStatus.use(auth(ROLES.ADMIN)).use(bodyParser());

// fetches medical statuses from tracking Sheets document
medicalStatus.get('/medical-statuses', async (ctx, next) => {
  const medicalStatuses = await fetchMedicalStatuses();
  ctx.type = 'application/json';
  ctx.status = 200;
  ctx.body = { data: medicalStatuses };
  return;
});
