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
  if(!user) {
    return res.status(500).json({msg: "No user found"})
  } else {
    return res.status(201).json({user}) 
  }
  if(!collaborator) {
    return res.status(500).json({msg: "No collaborator found"})
  } else {
    return res.status(201).json({collaborator})
  }
  

}

module.exports = {userRegister, collaboratorRegister, sessionLogin}