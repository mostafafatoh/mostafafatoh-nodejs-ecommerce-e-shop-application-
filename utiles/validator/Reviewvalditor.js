const { check, body } = require("express-validator");
const valditormiddlwares = require("../../middelware/valditormiddlware");
const Review = require("../../models/reviewModel");

exports.createReviewval = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 to 5"),
  check("user").isMongoId().withMessage("invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("invalid user id format")
    .custom((val, { req }) => {
      return Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("you already create a review before")
          );
        }
      });
    }),
  valditormiddlwares,
];

exports.getReviewval = [
  check("id").isMongoId().withMessage("invalid Review id format"),
  valditormiddlwares,
];

exports.updateReviewval = [
  check("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom((val, { req }) => {
      //check review ownership efore update
      return Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`there is no review with id ${val}`));
        }
        if (review.user.id.toString() !== req.user.id.toString()) {
          return Promise.reject(
            new Error(`you not allowed to update this review`)
          );
        }
      });
    }),

  valditormiddlwares,
];

exports.deleteReviewval = [
  check("id")
    .isMongoId()
    .withMessage(`invalid Review id format`)
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`there is no review for this id ${val}`)
            );
          }
          if (review.user.id.toString() !== req.user.id.toString()) {
            return Promise.reject(
              new Error(`you not allowed to delete this review`)
            );
          }
        });
      }
      return true;
    }),

  valditormiddlwares,
];
