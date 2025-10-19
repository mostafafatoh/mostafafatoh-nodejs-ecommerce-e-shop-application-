/* eslint-disable import/extensions */
const express = require("express");
const {
  createReviewval,
  updateReviewval,
  deleteReviewval,
} = require("../utiles/validator/Reviewvalditor.js");

const {
  getreivews,
  getreivew,
  createreivew,
  updatereivew,
  deletereivew,
  createfilterproduct,
  setproductidandUserIdToBody
} = require("../services/reviewsServices");

const Authorization = require("../services/authservice.js");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createfilterproduct, getreivews)
  .post(
    Authorization.protect,
    Authorization.allowedToaccess("user"),
    setproductidandUserIdToBody,
    createReviewval,
    createreivew
  );
router
  .route("/:id")
  .get(getreivew)
  .put(
    Authorization.protect,
    Authorization.allowedToaccess("user"),
    updateReviewval,
    updatereivew
  )
  .delete(
    Authorization.protect,
    Authorization.allowedToaccess("admin", "manger", "user"),
    deleteReviewval,
    deletereivew
  );

module.exports = router;
