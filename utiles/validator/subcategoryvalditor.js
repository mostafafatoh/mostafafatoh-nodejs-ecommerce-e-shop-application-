const { check, body } = require("express-validator");
const slugify = require("slugify");
const valditormiddlwares = require("../../middelware/valditormiddlware");

exports.createsubcategoryval = [
  check("name")
    .notEmpty()
    .withMessage("subcategory required")
    .isLength({ min: 2 })
    .withMessage("too short subcategory name")
    .isLength({ max: 35 })
    .withMessage("too long subcategory name").custom((val,{req})=>{
      req.body.slug=slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subcategory must be belong to parent category")
    .isMongoId()
    .withMessage("invalid category id format"),
  valditormiddlwares,
];

exports.getsubcategoryval = [
  check("id").isMongoId().withMessage("invalid subcategory id format"),
  valditormiddlwares,
];

exports.updatesubcategoryval = [
  check("id").isMongoId().withMessage("invalid subcategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  valditormiddlwares,
];

exports.deletesubcategryval = [
  check("id").isMongoId().withMessage("invalid subcategory id format"),
  valditormiddlwares,
];
