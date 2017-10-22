const express = require('express');
const userCtrl = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authmiddleware');
const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
module.exports = router;
