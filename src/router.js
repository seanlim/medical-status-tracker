import Router from "@koa/router";

import {fetchMedicalStatuses} from "./sheetsAPI";

const router = new Router();

router.get("/hello", async (ctx, next) => {
    ctx.message = "world";
    return;
});

router.get("/medical-statuses", async (ctx, next) => {
    const data = await fetchMedicalStatuses();
    delete data.undefined;
    delete data[""]
    ctx.type = 'application/json';
    ctx.res.statusCode = 200;
    ctx.body = data;
    return;
})

export default router;
