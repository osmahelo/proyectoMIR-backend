const User = require("../models/users");
const jwt = require("jsonwebtoken");
const Collaborator = require("../models/collaborator");
const { emailCompare } = require("../utils/emailCompare");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const SECRET = process.env.JWT_SECRETS;
const { sendEmail, sendEmailSendGrid } = require("../utils/send_email");
const crypto = require("crypto");

//Creación de usuario
const userRegister = async (req, res) => {
  const { name, email, password, lastName } = req.body;
  if (!name || !email || !password || !lastName) {
    throw new BadRequestError("Please provide name, lastname, email,password");
  }
  if (await emailCompare(email)) {
    throw new BadRequestError("Email already exists in Collabs");
  }
  const newUser = req.body;
  const hash = crypto.createHash("sha256").update(newUser.email).digest("hex");
  newUser.passwordResetToken = hash;
  newUser.passwordResetExpires = Date.now() + 3600000 * 24;
  const user = await User.create(newUser);
  const emailSend = {
    to: user.email,
    subject: "Bienvenido a Fix Hogar - Activa tu cuenta",
    template_id: "d-bae67e0c936b425ea1767135aa5909f5",
    dynamic_template_data: {
      name: user.name,
      url: `http://localhost:3000/activate/${user.passwordResetToken}/${user._id}`,
    },
  };
  sendEmailSendGrid(emailSend);
  res.status(StatusCodes.CREATED).json({ user });
};

const collaboratorRegister = async (req, res) => {
  const { name, email, password, lastName } = req.body;
  if (!name || !email || !password || !lastName) {
    throw new BadRequestError("Please provide name, lastname, email, password");
  }
  if (await emailCompare(email)) {
    throw new BadRequestError("Email already exists in Users");
  }
  const newCollaborator = req.body;
  const hash = crypto
    .createHash("sha256")
    .update(newCollaborator.email)
    .digest("hex");
  newCollaborator.passwordResetToken = hash;
  newCollaborator.passwordResetExpires = Date.now() + 3600000 * 24;
  const collaborator = await Collaborator.create(newCollaborator);
  const emailSend = {
    to: collaborator.email,
    subject: "Bienvenido a Fix Hogar - Activa tu cuenta",
    template_id: "d-bae67e0c936b425ea1767135aa5909f5",
    dynamic_template_data: {
      name: collaborator.name,
      url: `http://localhost:3000/activate/${collaborator.passwordResetToken}`,
    },
  };
  sendEmailSendGrid(emailSend);
  // sendEmail(req.body);
  res.status(StatusCodes.CREATED).json({ collaborator });
};
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  const collaborator = await Collaborator.findOne({ email });
  if (!user && !collaborator) {
    throw new UnauthenticatedError(
      "User was not found, credentials are invalid"
    );
  }
  if (user) {
    const isPasswordCorrect = await user.comparePassword(password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid password");
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      SECRET,
      { expiresIn: "1d" }
    );
    res.status(StatusCodes.OK).json({ user, token });
  }
  if (collaborator) {
    const isPasswordCorrectColab = await collaborator.comparePassword(password);
    if (!isPasswordCorrectColab) {
      throw new UnauthenticatedError("invalid password");
    }
    const token = jwt.sign(
      {
        id: collaborator._id,
      },
      SECRET,
      { expiresIn: "1d" }
    );
    res.status(StatusCodes.OK).json({ collaborator, token });
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

async function verifyAccount(req, res) {
  const { id, hash } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { active: true, passwordResetToken: null, passwordResetExpires: null },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Invalid Token" });
    }

    if (Date.now() > user.passwordResetExpires) {
      return res.status(404).json({ message: "Token expired" });
    }

    return res.status(200).json({ message: "Account Verified" });
  } catch (err) {
    return res.status(400).json(err);
  }
}

module.exports = {
  userRegister,
  collaboratorRegister,
  userLogin,
  getAllCollabs,
  verifyAccount,
};
