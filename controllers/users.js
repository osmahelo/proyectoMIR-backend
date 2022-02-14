const get = require('lodash/get');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const Collaborator = require('../models/collaborator');
const { emailExist } = require('../utils/emailCompare');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const SECRET = process.env.JWT_SECRETS;
const { sendEmailSendGrid } = require('../utils/send_email');
const crypto = require('crypto');

//Creación de usuario

const userRegister = async (req, res) => {
  const { name, email, password, lastName } = req.body;
  if (!name || !email || !password || !lastName) {
    throw new BadRequestError('Please provide name, lastname, email,password');
  }

  if (await emailExist(email)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: 'Email ya se encuentra registrado',
    });
    return;
  }

  const newUser = req.body;
  const hash = crypto.createHash('sha256').update(newUser.email).digest('hex');
  newUser.passwordResetToken = hash;
  newUser.passwordResetExpires = Date.now() + 3600000 * 24;
  const user = await User.create(newUser);
  const emailSend = {
    to: user.email,
    subject: 'Bienvenido a Fix Hogar - Activa tu cuenta',
    template_id: process.env.TEMPLATE_ID,
    dynamic_template_data: {
      name: user.name,
      url: `http://localhost:3000/activate/${user.passwordResetToken}/${user._id}`,
    },
  };
  sendEmailSendGrid(emailSend);
  res.status(StatusCodes.CREATED).json({ user });
};

const updateUser = async (user, image) => {
  const updatedUser = await User.findByIdAndUpdate(user._id, image, {
    new: true,
  });
  return updatedUser;
};
const updateCollab = async (collab, image) => {
  const updatedCollab = await Collaborator.findByIdAndUpdate(
    collab._id,
    image,
    {
      new: true,
    }
  );
  return updatedCollab;
};
const addBillingCustomerId = async (user, customerId) => {
  const creditCards = get(user, 'billing.creditCards', []);
  const customer = {
    billing: {
      creditCards,
      customerId,
    },
  };
  const updatedUser = await User.findByIdAndUpdate(user._id, customer, {
    new: true,
  });
  return updatedUser;
};

const collaboratorRegister = async (req, res) => {
  const { name, email, password, lastName, city } = req.body;
  if (!name || !email || !password || !lastName || !city) {
    throw new BadRequestError('Please provide name, lastname, email, password');
  }
  if (await emailExist(email)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: 'Email ya se encuentra registrado',
    });
    return;
  }
  const newCollaborator = req.body;
  const hash = crypto
    .createHash('sha256')
    .update(newCollaborator.email)
    .digest('hex');
  newCollaborator.passwordResetToken = hash;
  newCollaborator.passwordResetExpires = Date.now() + 3600000 * 24;
  const collaborator = await Collaborator.create(newCollaborator);
  const emailSend = {
    to: collaborator.email,
    subject: 'Bienvenido a Fix Hogar - Activa tu cuenta',
    template_id: process.env.TEMPLATE_ID,
    dynamic_template_data: {
      name: collaborator.name,
      url: `http://localhost:3000/activate/${collaborator.passwordResetToken}/${collaborator._id}`,
    },
  };
  sendEmailSendGrid(emailSend);
  res.status(StatusCodes.CREATED).json({ collaborator });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: 'Email y Contraseña son requeridos',
    });
    return;
  }
  const user = await User.findOne({ email });
  const collaborator = await Collaborator.findOne({ email });
  if (!user && !collaborator) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      msg: 'Email no esta registrado',
    });
    return;
  }
  if (user) {
    if (!user.active) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Aun no has Activado tu cuenta. Revisa tu correo' });
      return;
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        msg: 'Email o Contraseña Invalidos',
      });
      return;
    }
    const token = user.createJWT(req.body);
    res.status(StatusCodes.OK).json({ user, token });
    return;
  }
  if (collaborator) {
    if (!collaborator.active) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Aun no has Activado tu cuenta. Revisa tu correo' });
      return;
    }
    const isPasswordCorrectColab = await collaborator.comparePassword(password);
    if (!isPasswordCorrectColab) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        msg: 'Email o Contraseña Invalidos',
      });
      return;
    }

    const token = collaborator.createJWT(req.body);
    res.status(StatusCodes.OK).json({ collaborator, token });
    return;
  }
};

const getAllCollabs = async (req, res) => {
  const collab = await Collaborator.find(
    {},
    { name: 1, lastName: 1, city: 1, _id: 1 }
  );
  res.status(200).json({ collab });
};

async function findOneUser(query) {
  const user = await User.findOne(query);
  return user;
}
async function findOneCollaborator(query) {
  const collaborator = await Collaborator.findOne(query);
  return collaborator;
}

async function verifyAccount(req, res) {
  const { id } = req.params;
  try {
    const userExist = await User.findById({ _id: id });
    const collabExist = await Collaborator.findById({ _id: id });
    if (userExist) {
      const user = await User.findByIdAndUpdate(
        id,
        { active: true, passwordResetToken: null, passwordResetExpires: null },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'Invalid Token' });
      }
      if (Date.now() > user.passwordResetExpires) {
        return res.status(404).json({ message: 'Token expired' });
      }
    } else if (collabExist) {
      const collaborator = await Collaborator.findByIdAndUpdate(
        id,
        { active: true, passwordResetToken: null, passwordResetExpires: null },
        { new: true }
      );
      if (!collaborator) {
        return res.status(404).json({ message: 'Invalid Token' });
      }
      if (Date.now() > collaborator.passwordResetExpires) {
        return res.status(404).json({ message: 'Token expired' });
      }
    }
    return res.status(200).json({ message: 'Account Verified' });
  } catch (err) {
    return res.status(400).json(err);
  }
}

module.exports = {
  userRegister,
  collaboratorRegister,
  userLogin,
  getAllCollabs,
  updateUser,
  updateCollab,
  addBillingCustomerId,
  getAllCollabs,
  verifyAccount,
};
