const { check, body } = require("express-validator");
const slugify = require("slugify");
const valditormiddlwares = require("../../middelware/valditormiddlware");

exports.getcategoryvalidtor = [
  check("id").isMongoId().withMessage("invalid Category id format"),
  valditormiddlwares,
];

exports.createcategoorryvaldition = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short Category name")
    .isLength({ max: 35 })
    .withMessage("too long Category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  valditormiddlwares,
];
exports.updatecategoorryvaldition = [
  check("id").isMongoId().withMessage("invalid Category id format"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("category require")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 35 })
    .withMessage("too long Category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  valditormiddlwares,
];

exports.deletecategoorryvaldition = [
  check("id").isMongoId().withMessage("invalid Category id format"),
  valditormiddlwares,
];
