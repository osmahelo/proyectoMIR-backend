const express = require('express');
const router = express.Router();
const {
  userRegister,
  collaboratorRegister,
  userLogin,
} = require("../controllers/users");

//Ruta registro Usuario
router.route('/useregister').post(userRegister)

//Ruta registro Colaborador
router.route('/collabregister').post(collaboratorRegister)

//Ruta login user/collaborator
router.route("/userlogin").post(userLogin);



module.exports = router;