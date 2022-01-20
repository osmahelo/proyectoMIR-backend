const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRETS;
const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw Error('no authorization!');
    }
    const [, token] = authorization.split(' ');
    if (!token) {
      throw Error('no token!');
    }
    const { id } = jwt.verify(token, SECRET);
    req.collab = id;
    console.log(id);
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = auth;
