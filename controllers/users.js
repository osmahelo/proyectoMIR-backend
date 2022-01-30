const User = require("../models/users");
const jwt = require("jsonwebtoken");
const Collaborator = require("../models/collaborator");
const { emailCompare } = require("../utils/emailCompare");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const SECRET = process.env.JWT_SECRETS;
const { sendEmail, sendEmailSendGrid } = require("../utils/send_email");

//Creación de usuario
const userRegister = async (req, res) => {
  const { name, email, password, lastName } = req.body;
  if (!name || !email || !password || !lastName) {
    throw new BadRequestError("Please provide name, lastname, email,password");
  }
  if (await emailCompare(email)) {
    throw new BadRequestError("Email already exists in Collabs");
  }
  const user = await User.create({ ...req.body });
  const emailSend = {
    to: user.email,
    subject: "Bienvenido a Fix Hogar - Activa tu cuenta",
    template_id: "d-bae67e0c936b425ea1767135aa5909f5",
    dynamic_template_data: {
      name: user.name,
    },
  };
  sendEmailSendGrid(emailSend);
  //sendEmail(req.body);
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
  const collaborator = await Collaborator.create({ ...req.body });
  const emailSend = {
    to: collaborator.email,
    subject: "Bienvenido a Fix Hogar - Activa tu cuenta",
    template_id: "d-bae67e0c936b425ea1767135aa5909f5",
    dynamic_template_data: {
      name: collaborator.name,
    },
  };
  sendEmailSendGrid(emailSend);
  // sendEmail(req.body);
  res.status(StatusCodes.CREATED).json({ collaborator });
};
const userLogin = async (req, res) => {
  const { email, password } = req.body;
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
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid password");
    }
    res.status(StatusCodes.OK).json({ user });
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

module.exports = { userRegister, collaboratorRegister, userLogin };
