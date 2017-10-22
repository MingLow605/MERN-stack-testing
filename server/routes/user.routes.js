const express = require('express');
const userCtrl = require('../controllers/user.controller');
const router = express.Router(); //eslint-disable-line
const authMiddleware = require('../middlewares/authmiddleware');
const permission = require('../middlewares/permissionmiddleware');
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/update', authMiddleware.checkAuth, userCtrl.editUser);

router.get('/', authMiddleware.checkAuth, permission.checkAdmin, userCtrl.getUsers);
module.exports = router;
