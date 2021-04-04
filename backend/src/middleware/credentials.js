export default function credentials() {
    return async (ctx, next) => {
        ctx.set('Access-Control-Allow-Credentials', 'true');
        await next();
    };
}
