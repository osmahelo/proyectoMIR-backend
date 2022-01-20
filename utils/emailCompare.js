const User = require('../models/users');
const Collaborator = require('../models/collaborator');

const emailCompare = async (email) => {
  console.log(email);
  const emailCollab = await Collaborator.findOne({ email: email });
  const emailUser = User.findOne({ email });
  console.log('Email Exists', emailCollab);
  if (emailCollab) {
    return true;
  }
  if (emailUser) {
    return true;
  }
};

module.exports = { emailCompare };
