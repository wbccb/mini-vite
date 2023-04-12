const path = require("path");
const {init, parse} = require('es-module-lexer');
const parseImports = parse;
const {MagicString} = require('magic-string');


/**
 * 改变文件中所有import中所有裸模块路径
 */
function transformContent(source) {
    // 解析出imports和exports
    const [imports, exports] = parseImports(source);
    const magicString = new MagicString(source);

    if (!imports.length) {
        console.info("没有imports");
        return;
    }

    for (const importItem of imports) {
        const {
            s: start,
            e: end,
            n: specifier,
        } = importItem;
        console.info("importItem", start, end, specifier);

        if (!specifier) {
            continue;
        }
        const reg = /^[^\/\.]/;

        // 非"/"以及非"."，也就是裸模块的格式
        if (reg.test(specifier)) {
            // 替换路径
            const newSpecifier = `/@modules/${specifier}`;
            magicString.overwrite(start, end, newSpecifier);
        }
    }

    return magicString.toString();
}


module.exports = transformContent;