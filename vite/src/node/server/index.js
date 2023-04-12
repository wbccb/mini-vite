const initStaticServer = require("./middlewares/static.js");
const initImportRequest = require("./middlewares/initImportRequest.js");
const initModuleRequest = require("./middlewares/moduleRequest.js");
const initVueRequest = require("./middlewares/vueRequest.js");

/**
 * 初始化服务
 * @param context
 */
module.exports = function initServer(context) {

    initStaticServer(context);
    // 在vite的源码中，会使用固定的流程，比如transformRequest->doTransform->loadAndTransform
    // 这里为了简单，直接使用中间件进行路径的改写以及内容的转化

    // 改写裸模块的路径
    initImportRequest(context);
    // 处理（@modules/xxx）改写后裸模块的路径，使用对应的package.json找到对应的路径，读取文件内容，然后继续替换
    initModuleRequest(context);
    // 处理Vue文件
    initVueRequest(context);

}