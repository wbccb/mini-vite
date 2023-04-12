const koaStaticMiddleware = require("koa-static");
const path = require("path");


module.exports = function initStaticServer(context) {
    const {app, root, staticPath} = context;

    // 应该示例demo是静态服务器目录
    console.info("目前静态服务目录是", path.join(root, staticPath));

    app.use(koaStaticMiddleware(root));
    app.use(koaStaticMiddleware(path.join(root, staticPath)));
}