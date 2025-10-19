const express = require("express");
const {
  getloggedCart,
  addProductToUserCart,
  removeiteamfromcart,
  clearCart,
  updatecartItemQuantity,
  applycoupon,
} = require("../services/cartservices");
const {
  addproductToCartval,
  removeiteam,
} = require("../utiles/validator/cartValditor");
const Authorization = require("../services/authservice");
const router = express.Router();

router.use(Authorization.protect, Authorization.allowedToaccess("user"));
router
  .route("/")
  .post(addproductToCartval, addProductToUserCart)
  .get(getloggedCart)
  .delete(clearCart);
router.route("/applycoupon").put(applycoupon);

  router
  .route("/:itemId")
  .delete(removeiteam, removeiteamfromcart)
  .put(updatecartItemQuantity);

module.exports = router;
