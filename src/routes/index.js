const newsRouter = require('./news');
const AuthenticationRouter = require('./Authenication');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/authentications', AuthenticationRouter);
}
module.exports = route;
