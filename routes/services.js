const auth = require('../middleware/authorization');
const express = require('express');

const {
  CreateServices,
  UpdateService,
  DeleteService,
  GetServices,
  GetServicesByCollab,
  SearchServices,
} = require('../controllers/services');
const router = express.Router();

router.route('/services').post(auth, CreateServices).get(GetServices);
router.route('/service/:id').put(UpdateService).delete(DeleteService);
router.route('/collaborator/:id/services').get(GetServicesByCollab);
router.route('/search/services').get(SearchServices);

module.exports = router;
