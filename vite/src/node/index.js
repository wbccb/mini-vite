const Koa = require('koa');
const path = require("path");
const fs = require("fs");
const {readContentByStream} = require("./utils/fileUtils.js");
const transformContent = require("./utils/transfromContent.js");
const compilerSFC = require("@vue/compiler-sfc");
const compilerDOM = require("@vue/compiler-dom");


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

        let completeUrl = path.join(root, staticPath, url);

        console.info("目前的ctx", ctx);
        console.info("目前的completeUrl", completeUrl);

        if (url === "/") {
            ctx.type = "text/html";
            let content = fs.readFileSync(path.join(root, staticPath, "index.html"), "utf-8");

            // TODO 一开始插入insertToDOMStyle
            const injectCSSFn = `
                <script>
                    window.process = {
                        env: {
                            NODE_ENV: 'development'
                        }
                    };
                    function insertToDOMStyle(cssString) {
                        const styleTag = document.createElement("style");
                        styleTag.type = "text/css";
                        styleTag.innerHTML = cssString;
                        document.head.appendChild(styleTag);
                    }
                </script>
            `;
            ctx.body = content.replace(/<head>/, `<head>\n${injectCSSFn}`);
        } else if (url.endsWith("js")) {
            // 获取js文件内容，重写里面的node_modules模块的路径
            // 比如import {xx} from "vue" -> "@modules/vue"
            ctx.type = "application/javascript";
            const body = fs.readFileSync(completeUrl, "utf-8");
            ctx.body = transformContent(body);
        } else if (url.indexOf("@modules") >= 0) {
            // 找到对应的node_modules裸模块对应的package.json，然后获取真实路径，然后读取出对应的source数据

            ctx.type = "application/javascript";
            const realPath = resolvePath(ctx, url);
            const body = fs.readFileSync(realPath, "utf-8");
            ctx.body = transformContent(body); // 转化真实路径里面的import路径

        } else if (url.indexOf(".vue") >= 0) {
            // xxx.vue
            // xxx.vue&type=template
            // xxx.vue&type=style
            // xxx.vue&type=script
            
            ctx.type = "application/javascript";

            if (completeUrl.indexOf("?")) {
                completeUrl = completeUrl.split("?")[0];
            }
            const body = fs.readFileSync(completeUrl, "utf-8");
            const result = compilerSFC.parse(body);
            const {script, styles, template} = result.descriptor;

            console.info("ctx", ctx);


            if (!ctx.query.type) {
                // xxx.vue文件会解析为：<script>部分 + style(import) + template(import)返回
                let code = "";
                const resultScript = script.content.replace("export default", "const __script=");
                code = code + transformContent(resultScript);
                if (styles && styles.length) {
                    styles.forEach((style, index) => {
                        code = code + `\n import "${ctx.path}?type=style&index=${index}"`;
                    });
                }
                if (template) {
                    const templatePath = `"${ctx.path}?type=template"`;
                    code = code + `
                        \n import {render as __render} from ${templatePath};
                        \n __script.render = __render;
                    `
                }
                code = code + "\n export default __script";
                ctx.body = code;
            } else {
                switch (ctx.query.type) {
                    case "template":
                        const {code} = compilerSFC.compileTemplate({source: template.content});
                        ctx.body = transformContent(code);
                        break;
                    case "style":
                        // 多个style，比如5个style会被抽离为5个请求
                        const content = styles[parseInt(ctx.query.index)].content;
                        const cssContent = JSON.stringify(content);
                        ctx.body = `
                            \n const __css = ${cssContent};
                            \n insertToDOMStyle(__css);
                            \n export default __css;
                        `;
                        break;
                }
            }

        } else {
            // 不做任何处理
        }
    });

    app.listen(3000);
}

function resolvePath(ctx, url) {

    const moduleRegex = /^\/@modules\//;
    const moduleName = url.replace(moduleRegex, "");

    // 正常文件直接以package.json的main属性拿到对应的真实路径
    const packageJSONPath = path.join(root, staticPath, "node_modules", moduleName, "package.json");
    const contentString = fs.readFileSync(packageJSONPath, "utf-8");
    const contentObject = JSON.parse(contentString);
    if (contentObject.module) {
        return path.join(root, staticPath, "node_modules", moduleName, contentObject.module);
    }


    return "";
}

module.exports = {
    createServer
};
