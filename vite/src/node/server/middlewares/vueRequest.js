
module.exports = function initVueRequest(context) {
    const {app, root, staticPath} = context;

    app.use(async (ctx, next) => {
        if(!ctx.body || !ctx.response.is("vue")) {
            return;
        }

        console.info("initVueRequest", ctx.response)

    });
}