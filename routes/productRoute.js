const express = require("express");

const {
  getproducts,
  getproduct,
  createproduct,
  updateproduct,
  deleteprodct,
  uploadproductimages,
  resizeimage,
} = require("../services/productservice");
const {
  createproductval,
  getproductval,
  updateproductval,
  deleteproductval,
} = require("../utiles/validator/productvalditor");
const ReviewsRoutes=require('./ReviewsRoutes')

const Authorization = require("../services/authservice");
const router = express.Router();

//post /products/dgret45534525/reviews
//Get  /products/dgret45534525/reviews
//Get  /products/dgret45534525/reviews/dwwqd3terw4ef

router.use('/:productId/reviews',ReviewsRoutes);

router
  .route("/")
  .get(getproducts)
  .post(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    uploadproductimages,
    resizeimage,
    createproductval,
    createproduct
  );
router
  .route("/:id")
  .get(getproductval, getproduct)
  .put(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    uploadproductimages,
    resizeimage,
    updateproductval,
    updateproduct
  )
  .delete(
    Authorization.protect,
    Authorization.allowedToaccess("admin"),
    deleteproductval,
    deleteprodct
  );

module.exports = router;
