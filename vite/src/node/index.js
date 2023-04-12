const Koa = require('koa');
const initServer = require("./server/index.js");
const path = require("path");

const staticPath = "static";
const root = path.join(__dirname, '../..');

const createServer = ()=> {
    const app = new Koa();

    // 初始化多种服务，比如静态资源服务
    initServer({app, root, staticPath});


    app.listen(3000);
}

module.exports = {
    createServer
};
