class NewsController {
    index(req, res) {
        res.render('news');
    }
    show(req, res) {
        res.send('news detail');
    }
}
module.exports = new NewsController();
