const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const bearerHeader = req.get('Authorization');

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    if (bearer[0] == 'Bearer') {
      const token = bearer[1];
      jwt.verify(token, 'ilovetoptaltest', (err, decoded) => {
        if (err) {
          return res.status(401).send({message: 'Authorization failed'});
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({ message: 'Authorization failed' });
    }
  } else {
    return res.status(401).send({ message: 'Authorization failed' });
  }
};

module.exports = {
  checkAuth,
};
