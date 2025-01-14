const express = require('express');
const router = express.Router();
const Authentication = require('../Middleware/Authentication');
const AccountController = require('../app/controllers/AccountController');

router.post('/checkPassword', Authentication, AccountController.checkPassword);
router.post('/DeleteAccount', Authentication, AccountController.DeleteAccount);

module.exports = router;
