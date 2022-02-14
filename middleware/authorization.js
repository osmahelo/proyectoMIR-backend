const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Collaborator = require('../models/collaborator');
const compose = require('composable-middleware');

const getUserbyEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    console.log('getEmail', email);
    if (user) {
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};
const getCollabByEmail = async (email) => {
  try {
    const collab = await Collaborator.findOne({ email });
    if (collab) {
      return collab;
    }
  } catch (error) {
    console.log(error);
  }
};
const isAuthenticated = (req, res, next) => {
  return compose().use(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(500).json({ msg: 'No Token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded', decoded);
    const user = await getUserbyEmail(decoded.email);
    const collab = await getCollabByEmail(decoded.email);
    if (!user && !collab) {
      return res.status(500).json({ msg: 'Not authorized' });
    }

    req.user = user;
    req.collab = collab;
    next();
  });
};

module.exports = { isAuthenticated, getUserbyEmail };
