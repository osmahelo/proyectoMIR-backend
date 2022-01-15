

const userRegister = (req, res) => {
  res.status(200).json({msg:"User added"})
}

const collaboratorRegister = (req, res) => {
  res.send('Ruta registro de Colaborador')
}

module.exports = {userRegister, collaboratorRegister}