const {
  isAuthenticated,
  hasRole,
  getUserbyEmail,
} = require('../middleware/authorization');
const express = require('express');

const {
  CreateServices,
  UpdateService,
  DeleteService,
  GetServices,
  GetCitys,
  GetServicesByCollab,
  SearchServices,
} = require('../controllers/services');
const router = express.Router();

router.route('/city').get(GetCitys);
router
  .route('/services')
  .post(isAuthenticated(), CreateServices)
  .get(GetServices);
router.route('/service/:id').put(UpdateService).delete(DeleteService);
router
  .route('/collaborator/service')
  .get(isAuthenticated(), GetServicesByCollab);
router.route('/search/services').get(SearchServices);

module.exports = router;
