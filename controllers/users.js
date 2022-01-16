const User = require('../models/users')
const Collaborator = require('../models/collaborator')
const BadRequestError =require('../middleware/badRequest')


//Creación de usuario
const userRegister = async (req, res) => {
  const { name, email, password, lastName} = req.body;
  if(!name || !email || !password ||!lastName){
   throw new BadRequestError('Please provide name, lastname, email,password')
  }
  const user = await User.create({ ...req.body });
  res.status(200).json(req.body);
};

const collaboratorRegister = async (req, res) => {
  const collaborator = await Collaborator.create({...req.body})
  res.status(200).json(req.body)
  
}

const sessionLogin = async (req, res) => {
  const {email, password} = req.body;
  if (!email) {
    throw new BadRequestError("Please provide email and  password");
  }
  const user = await User.findOne({email})
  const collaborator = await Collaborator.findOne({email})
  if (user || collaborator) {
    if (user && !collaborator) res.status(201).json({ user });
    if (!user && collaborator) res.status(201).json({ collaborator });

  }
  else{
    throw new BadRequestError("invalid credentials");
  }

}

module.exports = {userRegister, collaboratorRegister, sessionLogin}