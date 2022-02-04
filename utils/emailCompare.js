const User = require('../models/users');
const Collaborator = require('../models/collaborator');

const emailCompare = async (email) => {
  const emailCollab = await Collaborator.findOne({ email });
  const emailUser = await User.findOne({ email });
  if (emailCollab || emailUser) {
    return true;
  }
  
};

module.exports = { emailCompare };
