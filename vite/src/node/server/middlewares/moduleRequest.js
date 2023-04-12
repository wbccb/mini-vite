const {readContentByStream} = require("../../utils/fileUtils.js");
const transformContent = require("../../utils/transfromContent.js");

module.exports = function initModuleRequest(context) {
    const {app, root, staticPath} = context;

    app.use(async (ctx, next) => {
        if(!ctx.body || !ctx.response.is("")) {
            return;
        }


    });
}