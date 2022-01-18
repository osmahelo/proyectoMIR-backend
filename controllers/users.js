const User = require('../models/users')
const Collaborator = require('../models/collaborator')
const { StatusCodes } = require("http-status-codes");
const {BadRequestError,UnauthenticatedError} = require('../errors')

//Creación de usuario
const userRegister = async (req, res) => {
  const { name, email, password, lastName} = req.body;
  if(!name || !email || !password ||!lastName){
   throw new BadRequestError('Please provide name, lastname, email,password')
  }
  const user = await User.create({ ...req.body });
   res.status(StatusCodes.CREATED).json({user});
};

const collaboratorRegister = async (req, res) => {
   const { name, email, password, lastName} = req.body;
  if(!name || !email || !password ||!lastName){
   throw new BadRequestError('Please provide name, lastname, email, password')
  }
  const collaborator = await Collaborator.create({...req.body})
  res.status(StatusCodes.CREATED).json({ collaborator });
  
}

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
     throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  const collaborator = await Collaborator.findOne({ email });
  if (!user && !collaborator) {
    throw new UnauthenticatedError("User was not found, credentials are invalid");
  }
  if(user){
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid password");
    }
    res.status(StatusCodes.OK).json({ user});
  }
  if(collaborator){
    const isPasswordCorrectColab = await collaborator.comparePassword(password);
    if (!isPasswordCorrectColab) {
      throw new UnauthenticatedError("invalid password");
    }
    res.status(StatusCodes.OK).json({collaborator});
  }
};


module.exports = { userRegister, collaboratorRegister, userLogin };