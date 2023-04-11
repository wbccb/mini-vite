const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    ctx.body = 'Hello World';
});

const initServer = ()=> {
    app.listen(3000);
}


module.exports = {
    initServer
};
