const User = require('../models/users');
const Collaborator = require('../models/collaborator');

const emailExist = async (email) => {
  const emailCollab = await Collaborator.findOne({ email });
  console.log(emailCollab);
  const emailUser = await User.findOne({ email });
  console.log(emailUser);
  if (emailCollab || emailUser) {
    console.log('entro aqui aunque no debia');
    return true;
  }
  return false;
};

module.exports = { emailExist };
