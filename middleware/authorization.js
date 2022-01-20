const jwt = require('jsonwebtoken');
//const { StatusCodes } = require("http-status-codes");
//const { BadRequestError } = require("../errors");

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
    const { id } = jwt.verify(token, 'MyScret');
    req.collab = id;
    console.log(id);
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

module.exports = auth;
