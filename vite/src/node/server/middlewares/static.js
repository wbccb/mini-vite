const koaStaticMiddleware = require("koa-static");
const path = require("path");


module.exports = function initStaticServer(context) {
    const {app, root, staticPath} = context;

    console.info("目前静态服务目录是", path.join(root, staticPath));

    app.use(koaStaticMiddleware(root));
    app.use(koaStaticMiddleware(path.join(root, staticPath)));
}