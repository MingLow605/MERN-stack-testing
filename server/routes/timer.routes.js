const express = require('express');
const timeCtrl = require('../controllers/timer.controller');
const authMiddleware = require('../middlewares/authmiddleware');
const router = express.Router(); // eslint-disable-line

router.post('/create', authMiddleware.checkAuth, timeCtrl.create);

module.exports = router;
