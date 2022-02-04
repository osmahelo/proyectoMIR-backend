const {isAuthenticated} = require("../middleware/authorization");
const express = require("express");
const router = express.Router();

const {
  createCardTokenHandler,
  createCustomerHandler,
  createPaymentHandler,
} = require("../controllers/payment.controller");

router.route("/card-token").post(isAuthenticated(), createCardTokenHandler);
router.route("/create-customer").post(isAuthenticated(), createCustomerHandler);
router.route("/make-payment").post(isAuthenticated(), createPaymentHandler);

module.exports = router;
