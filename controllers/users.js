const User = require('../models/users')
const Collaborator = require('../models/collaborator')
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require('../errors/bad-request')


//Creación de usuario
const userRegister = async (req, res) => {
  const { name, email, password, lastName} = req.body;
  if(!name || !email || !password ||!lastName){
   throw new BadRequestError('Please provide name, lastname, email, password')
  }
  const user = await User.create({ ...req.body });
   res.status(StatusCodes.CREATED).json({user});
};

const collaboratorRegister = async (req, res) => {
   const { name, email, password, lastName} = req.body;
  if(!name || !email || !password ||!lastName){
   throw new BadRequestError('Please provide name, lastname, email,password')
  }
  const collaborator = await Collaborator.create({...req.body})
  res.status(StatusCodes.CREATED).json({ collaborator });
  
}

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
     throw new BadRequestError('sera')
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("invalid credentials");
  }
  //compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("invalid credentials");
  }
  res.status(StatusCodes.OK).json({user});
};

const colabLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "needs password and email" });
  }
  const collaborator = await Collaborator.findOne({ email });
  if (!collaborator) {
    return res.status(400).json({ msg: "email does not exists" });
  }

  //compare password
  const isPasswordCorrectColab = await collaborator.comparePassword(password);
  if (!isPasswordCorrectColab) {
    return res.status(400).json({ msg: "invalid credentials" });
  }
  res.status(200).json({collaborator});
};


module.exports = { userRegister, collaboratorRegister, userLogin, colabLogin };