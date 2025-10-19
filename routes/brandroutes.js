/* eslint-disable import/extensions */
const express = require("express");
const {
  getbrandval,
  updatebrandval,
  createbrandval,
  deletebrandval,
} = require("../utiles/validator/brandvalditor.js");

const {
  getbrands,
  getspecificbrand,
  createbrand,
  updatebrand,
  deletebrand,
  uploadbrandsimage,
  resizeimage,
} = require("../services/brandsServices.js");

const Authorization = require("../services/authservice");

const router = express.Router();

router
  .route("/")
  .get(getbrands)
  .post(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    uploadbrandsimage,
    resizeimage,
    createbrandval,
    createbrand
  );
router
  .route("/:id")
  .get(getbrandval, getspecificbrand)
  .put(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger"),
    uploadbrandsimage,
    resizeimage,
    updatebrandval,
    updatebrand
  )
  .delete(
    Authorization.protect,
    Authorization.allowedToaccess("admin"),
    deletebrandval,
    deletebrand
  );

module.exports = router;
