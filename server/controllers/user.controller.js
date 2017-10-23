import User from '../models/user';
import Timer from '../models/timer';
import bcrypt from 'bcrypt';
import permission from '../contants/permissions';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
const checkUserDuplicate = (req, callback) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      callback({ status: 'error' });
      return;
    }
    if (user) {
      callback(user);
      return;
    }
    callback({ status: 'ok' });
  });
};

const signup = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    res.status(405).send('Missing Parameter');
  } else {
    checkUserDuplicate(req, (result) => {
      if (result.status === 'error') {
        res.status(403).send('Registed user');
      } else if (result.status === 'ok') {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (error, hash) => {
            const newUser = new User({
              name,
              email,
              password: hash,
              role: 'USER',
            });

            newUser.save((subError, data) => {
              if (subError) {
                res.status(403).send(subError);
              } else {
                const token = jwt.sign({ email: data.email, type: 'user', _id: data._id }, 'ilovetoptaltest');
                res.json({
                  status: 'success',
                  token,
                });
              }
            });
          });
        });
      } else {
        res.status(403).send('User already exists');
      }
    });
  }
};

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if ((!email || !password)) {
    res.status(405).send('Missing Parameter');
  } else {
    User.find({ email }, (err, users) => {
      if (err) {
        res.status(400).send(err);
      }

      if (users.length === 0) {
        res.status(403).send('Invalid Credentials');
        return;
      }
      if (!users[0].password) {
        res.status(403).send(`You must be login by ${users[0].source} account`);
      }
      bcrypt.compare(password, users[0].password, (subError, isPasswordMatch) => {
        if (isPasswordMatch === false) {
          res.status(403).send('Invalid Credentials');
        } else {
          if (permission.ADMIN) {
            users[0].role = 'ADMIN'; // eslint-disable-line
          } else if (permission.role === 'MANAGER') {
            users[0].role = 'MANAGER'; // eslint-disable-line
          } else {
            users[0].role = 'USER'; // eslint-disable-line
          }
          const token = jwt.sign({ email: users[0].email, type: 'user', _id: users[0]._id, role: users[0].role }, 'ilovetoptaltest');
          res.json({
            status: 'success',
            token,
          });
        }
      });
    });
  }
};

const editUser = (req, res) => {
  const name = req.body.name;
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const userId = new ObjectId(req.user._id);
  if (!name) {
    User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        throw new Error('Invalid login');
      }
      user.update({ $set: { name } })
      .then(() => {
        res.json({ status: 'success' });
      })
      .catch((err) => {
        res.status(403).send(err);
      });
    });
  }
  if ((!newPassword || !oldPassword)) {
    User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        res.status(404).send('Invalid login');
      }
      bcrypt.compare(oldPassword, user.password)
      .then((isPasswordMatch) => {
        if (!isPasswordMatch) {
          throw new Error('Old password is wrong');
        }
        return bcrypt.genSalt(10);
      })
      .then((hash) => {
        user.update({ $set: { password: hash } })
        .then(() => {
          res.json({ status: 'success' });
        });
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
  }
};

const getUsers = (req, res) => {
  return User.find()
  .then((users) => {
    if (users.length === 0) {
      throw new Error('Not find users');
    }
    res.json(users);
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

const deleteUser = (req, res) => {
  const deleteUserId = new ObjectId(req.params.id);
  if (!deleteUserId) res.status(405).send('Missing Paramerter');
  User.findOne({ _id: deleteUserId })
  .then((user) => {
    if (!user) throw new Error('Not find deleteUser');
    Timer.remove({ user: deleteUser }).exec();
    return user;
  })
  .then((user) => {
    user.remove();
  })
  .catch((err) => {
    res.status(400).send(err);
  });
};

module.exports = {
  signup,
  login,
  editUser,
  getUsers,
  deleteUser,
};
