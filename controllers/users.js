const get = require('lodash/get')
const User = require('../models/users');
const Collaborator = require('../models/collaborator');
const { emailCompare } = require('../utils/emailCompare');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const SECRET = process.env.JWT_SECRETS;
//Creación de usuario

const userRegister = async (req, res) => {
  const { name, email, password, lastName } = req.body;
  if (!name || !email || !password || !lastName) {
    throw new BadRequestError('Please provide name, lastname, email,password');
  }
  // if (emailCompare(email)) {
  //   throw new BadRequestError('Email already exists in Collabs');
  // }
  const user = await User.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ user });
};

const updateUser = async (id, user)=>{
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
}
const addBillingCustomerId = async (user, customerId) => {
  const creditCards = get(user, 'billing.creditCards', [])
  const customer = {
    billing: {
      creditCards,
      customerId
    }
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, customer, { new: true });
  return updatedUser;
};

const collaboratorRegister = async (req, res) => {
  const { name, email, password, lastName } = req.body;
  if (!name || !email || !password || !lastName) {
    throw new BadRequestError('Please provide name, lastname, email, password');
  }
  if (await emailCompare(email)) {
    throw new BadRequestError('Email already exists in Users');
  }
  const collaborator = await Collaborator.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ collaborator });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  const collaborator = await Collaborator.findOne({ email });
  if (!user && !collaborator) {
    throw new UnauthenticatedError(
      'User was not found, credentials are invalid'
    );
  }
  if (user) {
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid password');
    }
    const token = user.createJWT(req.body);
    res.status(StatusCodes.OK).json({ user, token });
  }
  if (collaborator) {
    const isPasswordCorrectColab = await collaborator.comparePassword(password);
    if (!isPasswordCorrectColab) {
      throw new UnauthenticatedError('invalid password');
    }
     const token = collaborator.createJWT(req.body);
    res.status(StatusCodes.OK).json({ collaborator, token });
  }
};



module.exports = {
  userRegister,
  collaboratorRegister,
  userLogin,
  updateUser,
  addBillingCustomerId,
};
