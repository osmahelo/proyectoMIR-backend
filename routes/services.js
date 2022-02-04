const auth = require('../middleware/authorization');
const express = require('express');

const {
  CreateServices,
  UpdateService,
  DeleteService,
  GetServices,
  GetCitys,
  GetServicesByCollab,
  SearchServices,
  paymentService,
} = require('../controllers/services');
const router = express.Router();

router.route('/services').post(auth, CreateServices).get(GetServices);
router.route('/city').get(GetCitys);
router.route('/service/:id').put(UpdateService).delete(DeleteService);
router.route('/collaborator/:id/services').get(GetServicesByCollab);
router.route('/search/services').get(SearchServices);
router.route('/service/payment/user').post(paymentService);

module.exports = router;
