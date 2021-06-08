import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import isEmpty from 'lodash/isEmpty';

import { getMedicalStatuses, updateApprovalStatus } from '~/sheetsAPI';
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

medicalStatus.put(
  '/update-status',
  auth(ROLES.ADMIN, ROLES.ALPHA, ROLES.BRAVO, ROLES.BNHQ),
  async (ctx, next) => {
    const { sheets, user } = ctx;
    const { id, status } = ctx.request.body;
    // check permissions
    let records = await getMedicalStatuses(sheets);
    records = records.filter((s) => s.id === id);
    if (isEmpty(records)) {
      ctx.body = { error: { message: 'Record does not exist' } };
      ctx.status = 500;
      return;
    }
    const record = records[0];
    if (user.role !== ROLES.ADMIN && user.role !== record.coy) {
      ctx.body = { error: { message: 'Unauthorized' } };
      ctx.status = 403;
      return;
    }
    // update
    try {
      await updateApprovalStatus(sheets, id, status);
    } catch (error) {
      console.error(error);
      ctx.body = { error: { message: 'Failed to update status' } };
      ctx.status = 500;
      return;
    }

    ctx.status = 200;
    return;
  }
);

module.exports = medicalStatus;
