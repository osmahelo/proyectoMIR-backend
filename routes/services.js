const express = require('express');
const {
  CreateServices,
  UpdateService,
  DeleteService,
  GetServices,
} = require('../controllers/services');
const router = express.Router();

router.route('/services').post(CreateServices).get(GetServices);
router.route('/service/:id').put(UpdateService).delete(DeleteService);
// !Change this                             👇 controller
router.route('/collaborator/services').get(GetServices);

module.exports = router;
