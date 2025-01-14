const newsRouter = require('./news');
const AuthenticationRouter = require('./Authenication');
const AccountRouter = require('./Account');

function route(app) {
    app.use('/news', newsRouter);
    app.use('/authentications', AuthenticationRouter);
    app.use('/account', AccountRouter);
}
module.exports = route;
