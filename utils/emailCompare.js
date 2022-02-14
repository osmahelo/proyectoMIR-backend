const User = require('../models/users');
const Collaborator = require('../models/collaborator');

const emailExist = async (email) => {
  const emailCollab = await Collaborator.findOne({ email });
  const emailUser = await User.findOne({ email });
  if (emailCollab || emailUser) {
    return true;
  }
  return false;
};

module.exports = { emailExist };
