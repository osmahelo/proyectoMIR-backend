

const userRegister = (req, res) => {
  res.send('Ruta registro de Usuario')
}

const collaboratorRegister = (req, res) => {
  res.send('Ruta registro de Colaborador')
}

module.exports = {userRegister, collaboratorRegister}