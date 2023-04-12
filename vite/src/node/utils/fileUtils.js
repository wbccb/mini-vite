const {Readable} = require("stream");

/**
 * 读取文件
 * @returns {Promise<void>}
 */
const readContentByStream = async (stream) => {

    if (stream instanceof Readable) {
        return new Promise((resolve, reject) => {
            let res = "";
            stream.on("data", (data) => {
                return res + data;
            });

            stream.on("end", () => {
                const result = res;
                res = "";
                resolve(result);
            });

            stream.on("error", (e) => {
                console.error("ready");
            });
        });
    } else {
        return stream.toString();
    }
}

module.exports = {
    readContentByStream
}