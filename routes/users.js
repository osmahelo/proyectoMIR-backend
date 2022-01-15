const express = require('express');
const router = express.Router();
const {userRegister, collaboratorRegister} = require('../controllers/users')

//Ruta registro Usuario
router.route('/registration').get(userRegister)

//Ruta registro Colaborador
router.route('/addinfo').post(collaboratorRegister)

//Ruta login user/collaborator
router.route('sessionlogin').post()

module.exports = router;