const {readContentByStream} = require("../../utils/fileUtils.js");
const transformContent = require("../../utils/transfromContent.js");

/**
 * 改写xx.js中存在的node_modules模块的路径
 * @param context
 */
module.exports = function initImportRequest(context) {
    const {app, root, staticPath} = context;

    app.use(async (ctx, next) => {
        // await next()会触发下一个中间件，等到下一个中间件执行完毕后，再执行下面的内容，称为洋葱圈模型

        console.info("触发initImportRequest");

        if(!ctx.body || !ctx.response.is("js")) {
            return;
        }


        // 获取js文件内容，重写里面的node_modules模块的路径
        // 比如import {xx} from "vue" -> "@modules/vue"
        const content = await readContentByStream(ctx.body);
        ctx.body = transformContent(content);
    });
}