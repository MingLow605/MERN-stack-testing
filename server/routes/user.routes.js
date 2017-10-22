const express = require('express');
const userCtrl = require('../controllers/user.controller');
const router = express.Router(); //eslint-disable-line

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
module.exports = router;
