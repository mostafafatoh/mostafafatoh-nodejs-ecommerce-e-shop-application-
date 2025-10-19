const { param, check } = require("express-validator");
const valditormiddlwares = require("../../middelware/valditormiddlware");

exports.cashorderval = [
  param("cartId")
    .notEmpty()
    .withMessage("cart iD is required")
    .isMongoId()
    .withMessage("invalid cartId "),
  check("shippingAddress.details")
    .notEmpty()
    .withMessage("Shipping address details are required"),
  check("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  check("shippingAddress.city").notEmpty().withMessage("city is required"),
  valditormiddlwares
];
