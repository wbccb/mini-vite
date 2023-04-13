const Koa = require('koa');
const path = require("path");
const fs = require("fs");
const {readContentByStream} = require("./utils/fileUtils.js");
const transformContent = require("./utils/transfromContent.js");

const staticPath = "../playground";
const root = path.join(__dirname, '../..');

const createServer = () => {
    const app = new Koa();

    // 处理html、css、js、vue等基础数据
    app.use(async (ctx, next) => {

        const {url} = ctx.request;

        if (ctx.body) {
            return;
        }

        const completeUrl = path.join(root, staticPath, url);

        console.info("目前的ctx", ctx);
        console.info("目前的completeUrl", completeUrl);

        if (url === "/") {
            ctx.type = "text/html";
            ctx.body = fs.readFileSync(path.join(root, staticPath, "index.html"), "utf-8");
        } else if (url.endsWith("js")) {
            // 获取js文件内容，重写里面的node_modules模块的路径
            // 比如import {xx} from "vue" -> "@modules/vue"
            ctx.type = "text/javascript";
            const body = fs.readFileSync(completeUrl, "utf-8");
            ctx.body = transformContent(body);
        } else if (url.indexOf("@modules") >= 0) {
            // 找到对应的node_modules裸模块对应的package.json，然后获取真实路径，然后读取出对应的source数据

            ctx.type = "text/javascript";
            const realPath = resolvePath(ctx, url);
            const body = fs.readFileSync(realPath, "utf-8");
            ctx.body = transformContent(body); // 转化真实路径里面的import路径

        } else if (url.indexOf(".vue") >= 0) {
            // xxx.vue
            // xxx.vue&type=template
            // xxx.vue&type=style
            // xxx.vue&type=script
        } else {

        }

        return true;
    });

    app.listen(3000);
}

function resolvePath(ctx, url) {


    debugger;
    const moduleRegex = /^\/@modules\//;
    const moduleName = url.replace(moduleRegex, "");

    // 正常文件直接以package.json的main属性拿到对应的真实路径
    const packageJSONPath = path.join(root, staticPath, "node_modules", moduleName, "package.json");
    const contentString = fs.readFileSync(packageJSONPath, "utf-8");
    const contentObject = JSON.parse(contentString);
    if(contentObject.module) {
        return path.join(root, staticPath, "node_modules", moduleName, contentObject.module);
    }

    // 解析vue单文件

    return "";
}

module.exports = {
    createServer
};
