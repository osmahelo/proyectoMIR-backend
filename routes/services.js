const { isAuthenticated } = require('../middleware/authorization');
const express = require('express');

const {
  CreateServices,
  UpdateService,
  DeleteService,
  GetServices,
  GetCitys,
  GetServicesByCollab,
  GetServicesRequests,
  SearchServices,
  scheduleServiceHandler,
} = require('../controllers/services');
const router = express.Router();

router.route('/city').get(GetCitys);
router
  .route('/services')
  .get(GetServices)
  .post(isAuthenticated(), CreateServices)
  .put(isAuthenticated(), UpdateService)
  .delete(isAuthenticated(), DeleteService);
router
  .route('/collaborator/service')
  .get(isAuthenticated(), GetServicesByCollab);
router.route('/requests/service').get(isAuthenticated(), GetServicesRequests);
router.route('/search/services').get(SearchServices);
//Ruta servicio solicitado
router
  .route('/schedule/service')
  .post(isAuthenticated(), scheduleServiceHandler);

module.exports = router;
