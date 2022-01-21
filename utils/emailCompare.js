const User = require('../models/users');
const Collaborator = require('../models/collaborator');

const emailCompare = async (email) => {
  const emailCollab = await Collaborator.findOne({ email: email });
  const emailUser = await User.findOne({ email: email });
  if (emailCollab) {
    return true;
  }
  if (emailUser) {
    return true;
  }
};

module.exports = { emailCompare };
