const { check } = require("express-validator");
const valditormiddlware = require("../../middelware/valditormiddlware");

exports.addproductTowishlistval = [
  check("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("invalid User id format"),
  valditormiddlware,
];

exports.deleteproductTowishlistval = [
  check("productId")
    .notEmpty()
    .withMessage("product is required")
    .isMongoId()
    .withMessage("invalid User id format"),
  valditormiddlware,
];
