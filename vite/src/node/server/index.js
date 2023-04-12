const initStaticServer = require("./middlewares/static.js");

/**
 * 初始化服务
 * @param context
 */
module.exports = function initServer(context) {



    initStaticServer(context);
}