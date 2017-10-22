import express from 'express';
const router = express.Router();

const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');
const timerRoutes = require('./timer.routes');
router.use('/users', userRoutes);
router.use('/timer', timerRoutes);
// router.use('/posts', postRoutes);
export default router;
