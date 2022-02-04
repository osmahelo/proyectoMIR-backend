const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Collaborator = require("../models/collaborator");
const compose = require("composable-middleware");

const getUserbyEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    const collaborator = await Collaborator.findOne({ email });

    if (user) {
      return user;
    }
    if (collaborator) {
      return collaborator;
    }
  } catch (error) {
    console.log(error);
  }
};
const isAuthenticated = (req, res, next) => {
  return compose().use(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(500).json({ msg: "No Token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserbyEmail(decoded.email);
    const collab = await getUserbyEmail(decoded.email);

    if (!user) {
      return res.status(500).json({ msg: "Not authorized" });
    }
    if (!collab) {
      return res.status(500).json({ msg: "Not authorized" });
    }
    req.user = user;
    req.collab = collab;
    next();
  });
};

// const hasRole = (roles) => {
//   return compose()
//     .use(isAuthenticated())
//     .use((req, res, next) => {
//       const { user } = req;
//       if (roles.includes(user.role)) {
//         return res.status(403).json("forbidden");
//       }
//       next();
//     });
// };

module.exports = { isAuthenticated, hasRole, getUserbyEmail };
