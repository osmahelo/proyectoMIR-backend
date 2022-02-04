const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  userRegister,
  collaboratorRegister,
  userLogin,
  getAllCollabs,
  verifyAccount,
} = require('../controllers/users');
const {
  uploadSingleHandler,
  uploadMultipleHandler,
} = require('../utils/upload/upload.controller');

const upload = multer({ dest: "./temp" });

//Ruta registro Usuario
router.route('/useregister').post(userRegister);

//Ruta registro Colaborador
router.route('/collabregister').post(collaboratorRegister);

//Ruta de todos los colaboradores
router.route('/allcollabs').get(getAllCollabs);

//Ruta verificación email
router.route("/activate/:hash/:id").post(verifyAccount);

//Ruta login user/collaborator
router.route('/sessionlogin').post(userLogin);

//Ruta carga imágenes user/collaborator
router.route('/file/user').post(upload.single('image'), uploadSingleHandler);
router.route('file/collab').post(upload.single('image'), uploadSingleHandler);

//Ruta carga imágenes múltiples
router
  .route('/files/collab')
  .post(upload.array('image'), uploadMultipleHandler);

module.exports = router;
