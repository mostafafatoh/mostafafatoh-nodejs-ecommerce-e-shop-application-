const express = require("express");
const {
  createsubcategory,
  getsubcategory,
  getsubcategories,
  deletesubcategory,
  updatesubcategory,
  setcategoryIdtoBody,
  createfiltecategory,
} = require("../services/subcategoruservice");
const {
  createsubcategoryval,
  getsubcategoryval,
  updatesubcategoryval,
  deletesubcategryval,
} = require("../utiles/validator/subcategoryvalditor");

const Authorization = require("../services/authservice");

//@merge params allow to access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    setcategoryIdtoBody,
    createsubcategoryval,
    createsubcategory
  )
  .get(createfiltecategory, getsubcategories);
router
  .route("/:id")
  .get(getsubcategoryval, getsubcategory)
  .put(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    updatesubcategoryval,
    updatesubcategory
  )
  .delete(
    Authorization.protect,
    Authorization.allowedToaccess("admin"),
    deletesubcategryval,
    deletesubcategory
  );
module.exports = router;
