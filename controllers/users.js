const User = require('../models/users')
const Collaborator = require('../models/collaborator')


//Creación de usuario
const userRegister = async (req, res) => {
  const user = await User.create({...req.body})
  res.status(200).json(req.body)
  
}

const collaboratorRegister = async (req, res) => {
  const collaborator = await Collaborator.create({...req.body})
  res.status(200).json(req.body)
  
}

const sessionLogin = async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email})
  const collaborator = await Collaborator.findOne({email})
  if(user || collaborator) {
    res.status(201).json({user, collaborator}) 
  } else {
    res.status(500).json({msg: "No found"})
  }

}

module.exports = {userRegister, collaboratorRegister, sessionLogin}