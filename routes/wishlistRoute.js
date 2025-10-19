const express = require("express");
const Authorization = require("../services/authservice");
const {
  addproductTowishlistval,
  deleteproductTowishlistval,
} = require("../utiles/validator/wishlistValditor");
const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getallwishlist,
} = require("../services/wishlist");

const router = express.Router();
router.use(Authorization.protect, Authorization.allowedToaccess("user"));
router
  .route("/")
  .post(addproductTowishlistval, addProductToWishlist)
  .get(getallwishlist);
router
  .route("/:productId")
  .delete(deleteproductTowishlistval, deleteProductFromWishlist);

module.exports = router;
