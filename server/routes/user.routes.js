const express = require('express');
const userCtrl = require('../controllers/user.controller');
const router = express.Router(); //eslint-disable-line
const authMiddleware = require('../middlewares/authmiddleware');
const permissionMiddleware = require('../middlewares/permissionmiddleware');
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.put('/update', authMiddleware.checkAuth, userCtrl.editUser);

router.get('/', authMiddleware.checkAuth, permissionMiddleware.checkAdminWithManager, userCtrl.getUsers);

router.delete('/:id', authMiddleware.checkAuth, permissionMiddleware.checkAdminWithManager, userCtrl.deleteUser);
module.exports = router;
