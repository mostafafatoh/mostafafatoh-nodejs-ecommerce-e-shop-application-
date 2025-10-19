const { check } = require("express-validator");

const valditormiddlwares = require("../../middelware/valditormiddlware");
const Coupon = require("../../models/coupon");
exports.getoneCouponval = [
  check("id")
    .notEmpty()
    .withMessage("coupon id is required")
    .isMongoId()
    .withMessage("invalid coupon id format"),
  valditormiddlwares,
];

exports.createCouponval = [
  check("name")
    .notEmpty()
    .withMessage("coupon name is required")
    .custom(async (val) => {
      const CouponName = await Coupon.findOne({ name: val });
      if (CouponName) {
        return Promise.reject(
          new Error("Coupon name already exists, choose another name")
        );
      }
    }),
  check("expire")
    .notEmpty()
    .withMessage("Coupon expire date is required")
    .custom((val) => {
      const expiredate = new Date(val);
      if (expiredate < new Date()) {
        throw new Error("Expire date must be in the future");
      }
      return true;
    }),
  check("discount")
    .notEmpty()
    .withMessage("discount is required")
    .isNumeric()
    .withMessage("discount must be a number")
    .custom((val) => {
      if (val <= 0 || val > 100) {
        throw new Error("discount must be between 0 and 100");
      }
      return true;
    }),
  valditormiddlwares,
];

exports.updateCouponval = [
  check("id")
    .notEmpty()
    .withMessage("coupon id is required")
    .isMongoId()
    .withMessage("invalid coupon id format"),
  check("name")
    .optional()
    .custom(async (val, { req }) => {
      const Couponname = await Coupon.findOne({
        name: val.trim().toLowerCase(),
      });
      if (Couponname && Couponname.id.toString() !== req.params.id) {
        throw new Error("Coupon name already exists, choose another name");
      }
    }),
  check("expire")
    .optional()
    .custom((val) => {
      const expiredate = new Date(val);
      if (expiredate < new Date()) {
        throw new Error("Expire date must be in the future");
      }
      return true;
    }),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number")
    .custom((val) => {
      if (val <= 0 || val >= 100) {
        throw new Error("discount must be between 0 and 100");
      }
      return true;
    }),

  valditormiddlwares,
];

exports.deletecouponval = [
  check("id")
    .notEmpty()
    .withMessage("coupon id is required")
    .isMongoId()
    .withMessage("invalid coupon id format"),
  valditormiddlwares,
];
