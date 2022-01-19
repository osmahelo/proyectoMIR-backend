const auth = require('../middleware/authorization')
const express = require('express');

const {
  CreateServices,
  UpdateService,
  DeleteService,
  GetServices,
  GetServicesByUser,
} = require('../controllers/services');
const router = express.Router();

router.route('/services').post(auth, CreateServices).get(GetServices);
router.route('/service/:id').put(UpdateService).delete(DeleteService);
// !Change this                             👇 controller
router.route("/collaborator/:id/services").get(GetServicesByUser);

module.exports = router;
