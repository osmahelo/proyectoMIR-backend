const express = require('express');
const router = express.Router();
const {userRegister, collaboratorRegister, sessionLogin} = require('../controllers/users')

//Ruta registro Usuario
router.route('/useregister').post(userRegister)

//Ruta registro Colaborador
router.route('/collabregister').post(collaboratorRegister)

//Ruta login user/collaborator
router.route('/sessionlogin').post(sessionLogin)

module.exports = router;