const express = require("express");
const {
  getcategories,
  creatCategory,
  getcategory,
  updateCategory,
  DeleteCategory,
  uploadcategoryimage,
  resizeimage,
} = require("../services/categoryservice");
const {
  getcategoryvalidtor,
  updatecategoorryvaldition,
  createcategoorryvaldition,
  deletecategoorryvaldition,
} = require("../utiles/validator/categoryvalidator");

const Authorization = require("../services/authservice");

const subcategoryroute = require("./subcategryroute");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoryroute);
router
  .route("/")
  .get(getcategories)
  .post(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    uploadcategoryimage,
    resizeimage,
    createcategoorryvaldition,
    creatCategory
  );
router
  .route("/:id")
  .get(getcategoryvalidtor, getcategory)
  .put(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    uploadcategoryimage,
    resizeimage,
    updatecategoorryvaldition,
    updateCategory
  )
  .delete(
    Authorization.protect,
    Authorization.allowedToaccess("admin"),
    deletecategoorryvaldition,
    DeleteCategory
  );

module.exports = router;
