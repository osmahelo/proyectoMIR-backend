const User = require('../models/users')

//Creación de usuario
const userRegister = async (req, res) => {
  const user = await User.create({...req.body})
  res.status(200).json(req.body)
  
}

const collaboratorRegister = (req, res) => {
  res.send('Ruta registro de Colaborador')
}

module.exports = {userRegister, collaboratorRegister}