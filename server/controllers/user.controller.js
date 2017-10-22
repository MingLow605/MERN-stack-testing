import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signup = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    res.status(405).send('Missing Parameter');
  } else {
    checkUserDuplicate (req, (result) => {
      if (result.status == 'error') {
        res.status(403).send('Registed user');
      } else if (result.status == 'ok') {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            let newUser = new User({
              name: name,
              email: email,
              password: hash,
              role: 'user',
            });

            newUser.save((error, data) => {
              if (error) {
                res.status(403).send(error);
              } else {
                const token = jwt.sign({ email: data.email, type: 'user', _id: data._id }, 'ilovetoptaltest');
                res.json({
                  status: 'success',
                  token: token
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
    User.find({email: email}, (err, users) => {
      if (err) {
        res.status(400).send(err);
      }
      console.log(users.length);
      if (users.length == 0) {
        res.status(403).send('Invalid Credentials');
        return;
      }
      if (!users[0].password) {
        res.status(403).send('You must be login by' + users[0].source + ' account');
      }
      bcrypt.compare(password, users[0].password, (err, isPasswordMatch) => {
        if (isPasswordMatch == false) {
          res.status(403).send('Invalid Credentials');
        } else {
          const token = jwt.sign({ email: users[0].email, type: 'user', _id: users[0]._id }, 'ilovetoptaltest');
          console.log(token);
          res.json({
            status: 'success',
            token: token
          });
        }
      });
    });
  }
}



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

module.exports = {
  signup,
  login,
};
