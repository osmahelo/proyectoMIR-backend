const {
  isAuthenticated,
  getUserbyEmail,
} = require("../middleware/authorization");
const express = require("express");

const {
  CreateServices,
  UpdateService,
  DeleteService,
  GetServices,
  GetCitys,
  GetServicesByCollab,
  SearchServices,
  scheduleServiceHandler,
} = require("../controllers/services");
const router = express.Router();

router.route("/city").get(GetCitys);
router
  .route("/services")
  .post(isAuthenticated(), CreateServices)
  .get(GetServices);
router.route("/service/:id").put(UpdateService).delete(DeleteService);
router.route("/collaborator/:id/services").get(GetServicesByCollab);
router.route("/search/services").get(SearchServices);
//Ruta servicio solicitado
router
  .route("/schedule/service")
  .post(isAuthenticated(), scheduleServiceHandler);

module.exports = router;
