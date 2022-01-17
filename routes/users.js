const express = require('express');
const router = express.Router();
const {
  userRegister,
  collaboratorRegister,
  userLogin,
  colabLogin,
} = require("../controllers/users");

//Ruta registro Usuario
router.route('/useregister').post(userRegister)

//Ruta registro Colaborador
router.route('/collabregister').post(collaboratorRegister)

//Ruta login user/collaborator
router.route("/userlogin").post(userLogin);
router.route("/colablogin").post(colabLogin);


module.exports = router;