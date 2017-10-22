import User from '../models/user';
import mongoose from 'mongoose';
import Permission from '../contants/permissions';

const ObjectId = mongoose.Types.ObjectId;
const checkAdmin = (req, res, next) => {
  const userId = new ObjectId(req.user._id);
  User.findOne({ _id: userId })
  .then((user) => {
    if (user.role === Permission.ADMIN) {
      next();
    } else res.status(401).send('Permission Error');
  });
};

const checkManager = (req, res, next) => {
  const userId = new ObjectId(req.user._id);
  User.findOne({ _id: userId })
  .then((user) => {
    if (user.role === Permission.MANAGE) {
      next();
    } else res.status(401).send('Permission Error');
  });
};

const checkRegularUser = (req, res, next) => {
  const userId = new ObjectId(req.user._id);
  User.findOne({ _id: userId })
  .then((user) => {
    if (user.role === Permission.USER) {
      next();
    } else res.status(401).send('Permission Error');
  });
};
module.exports = {
  checkAdmin,
  checkManager,
  checkRegularUser,
};
