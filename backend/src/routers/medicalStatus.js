import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

import { getMedicalStatuses } from '~/sheetsAPI';
import { ROLES } from '~/constants';
import { auth } from '~/middleware/auth';

const medicalStatus = new Router();

medicalStatus.use(bodyParser());

medicalStatus.get(
  '/medical-statuses',
  auth(ROLES.ADMIN, ROLES.ALPHA, ROLES.BRAVO, ROLES.BNHQ),
  async (ctx, next) => {
    const { sheets, user } = ctx;
    let medicalStatuses = await getMedicalStatuses(sheets);
    if (user.role !== ROLES.ADMIN) {
      medicalStatuses = medicalStatuses.filter((s) => s.coy === user.role);
    }
    ctx.type = 'application/json';
    ctx.status = 200;
    ctx.body = { data: medicalStatuses };
    return;
  }
);

module.exports = medicalStatus;
