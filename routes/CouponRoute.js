const express = require("express");
const Authorization = require("../services/authservice");
const {
  getoneCouponval,
  createCouponval,
  updateCouponval,
  deletecouponval,
} = require("../utiles/validator/Couponvalditor");
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponservice");

const router = express.Router();
router.use(
  Authorization.protect,
  Authorization.allowedToaccess("admin", "manger")
);
router.route("/").get(getCoupons).post(createCouponval, createCoupon);

router
  .route("/:id")
  .put(updateCouponval,updateCoupon)
  .get(getoneCouponval, getCoupon)
  .delete(deletecouponval, deleteCoupon);

module.exports = router;
