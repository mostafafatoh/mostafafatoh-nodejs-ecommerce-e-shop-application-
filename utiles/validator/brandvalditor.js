const { check, body } = require("express-validator");
const slugify = require("slugify");
const valditormiddlwares = require("../../middelware/valditormiddlware");

exports.getbrandval = [
  check("id").isMongoId().withMessage("invalid brand id format"),
  valditormiddlwares,
];

exports.updatebrandval = [
  check("id").isMongoId().withMessage("invalid brand id format"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage(`too short brand name`)
    .isLength({ max: 34 })
    .withMessage(`too long brand name`)
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  valditormiddlwares,
];

exports.createbrandval = [
  check("name")
    .notEmpty()
    .withMessage(`name is required`)
    .isLength({ min: 3 })
    .withMessage(`too short brand name`)
    .isLength({ max: 34 })
    .withMessage(`too long brand name`)
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  valditormiddlwares,
];

exports.deletebrandval = [
  check("id").isMongoId().withMessage(`invalid brand id format`),
  valditormiddlwares,
];
