const express = require('express');
const {
  CreateServices,
  UpdateServices,
  DeleteServices,
  GetServices,
} = require('../controllers/services');
const router = express.Router();

router.route('/services').post(CreateServices).get(GetServices);
router.route('/services/:id').put(UpdateServices).delete(DeleteServices);
router.route('/collaborator/services').get(GetServices);

module.exports = router;
