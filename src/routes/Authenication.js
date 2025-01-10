const express = require('express');
const router = express.Router();

const NewsController = require('../app/controllers/NewsController');
const AuthenticationsController = require('../app/controllers/AuthenticationsController');

router.post('/createTemporaryAccount', AuthenticationsController.createTemporaryAccount);
router.post('/signup', AuthenticationsController.signup);
router.post('/deleteAuthCode', AuthenticationsController.deleteAuthCode);
router.post('/resendAuthCode', AuthenticationsController.resendAuthCode);
router.post('/signin', AuthenticationsController.signin);
router.get('/UserAuthenticate', AuthenticationsController.UserAuthenticate);
router.get('/:slug', NewsController.show);

module.exports = router;
