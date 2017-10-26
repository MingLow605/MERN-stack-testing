const express = require('express');
const timeCtrl = require('../controllers/timer.controller');
const permissionMiddleware = require('../middlewares/permissionmiddleware');
const authMiddleware = require('../middlewares/authmiddleware');
const router = express.Router(); // eslint-disable-line

router.post('/create', authMiddleware.checkAuth, timeCtrl.create);

router.put('/update/:id', authMiddleware.checkAuth, permissionMiddleware.checkAdminWithUser, timeCtrl.editTimer);

router.get('/', authMiddleware.checkAuth, permissionMiddleware.checkAdminWithUser, timeCtrl.getRecordAll);

router.delete('/:id', authMiddleware.checkAuth, permissionMiddleware.checkAdminWithUser, timeCtrl.deleteRecord);
module.exports = router;
