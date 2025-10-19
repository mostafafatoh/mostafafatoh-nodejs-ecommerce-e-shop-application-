const { check } = require("express-validator");
const valditormiddlwares = require("../../middelware/valditormiddlware");
const Cart = require("../../models/shopingCart");
exports.addproductToCartval = [
  check("productId")
    .notEmpty()
    .withMessage("productid is required")
    .isMongoId()
    .withMessage("invalid id format"),
  check("color").notEmpty().withMessage("color is required"),
  ,
  valditormiddlwares,
];

exports.removeiteam = [
  check("itemId")
    .notEmpty()
    .withMessage("itemId is required")
    .isMongoId()
    .withMessage("invalid itemId format")
    .custom(async (val, { req }) => {
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        throw new Error("No cart found for this user");
      }
      const iteamexist = cart.cartIteam.find(
        (iteam) => iteam.id.toString() === val
      );
      if (!iteamexist) {
        throw new Error("This item does not exist in your cart");
      }
      return true;
    }),
  valditormiddlwares,
];
