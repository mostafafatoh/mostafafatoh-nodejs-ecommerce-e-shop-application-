const express = require("express");
const { cashorderval } = require("../utiles/validator/ordervalditor");
const {
  getallorder,
  getspecific,
  filterUserorder,
  Cashorder,
  UpdatePaidStatus,
  UpdateDeliverStatus,
  getCheckoutSession,
} = require("../services/orderservices");
const Authorization = require("../services/authservice");

const router = express.Router();
router.use(Authorization.protect);

router
  .route("/checkout-session/:cartId")
  .get(Authorization.allowedToaccess("user"), getCheckoutSession);

router
  .route("/:cartId")
  .post(Authorization.allowedToaccess("user"), cashorderval, Cashorder);
router
  .route("/")
  .get(
    Authorization.allowedToaccess("user", "admin", "manger"),
    filterUserorder,
    getallorder
  );
router
  .route("/:id")
  .get(Authorization.allowedToaccess("user", "admin", "manger"), getspecific);
router
  .route("/:id/pay")
  .put(Authorization.allowedToaccess("admin", "manger"), UpdatePaidStatus);
router
  .route("/:id/deliver")
  .put(Authorization.allowedToaccess("admin", "manger"), UpdateDeliverStatus);

module.exports = router;
