const slugify=require('slugify');
const { check, body } = require("express-validator");
const valditormiddlwares = require("../../middelware/valditormiddlware");
const Category = require("../../models/categorymodels");
const subcategory = require("../../models/subcategorymodel");

exports.createproductval = [
  check("title")
    .notEmpty()
    .withMessage("title name is required")
    .isLength({ min: 3 })
    .withMessage("too short product title").custom((val,{req})=>{
      req.body.slug=slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 2000 })
    .withMessage("too long product description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("product quantity must a be number")
    .isFloat({ max: 20000000 })
    .withMessage("too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("price must be number")
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(`priceAfterDiscount must be lower than price`);
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be array of string"),
  check("imageCover").notEmpty().withMessage("product image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("product must be belong to category")
    .isMongoId()
    .withMessage("invalid ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`no category id for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("invalid ID format")
    .custom((subcategoryid) =>
      subcategory
        .find({ _id: { $exists: true, $in: subcategoryid } })
        .then((result) => {
          if (result.length < 1 || result.length !== subcategoryid.length) {
            return Promise.reject(
              new Error(`invalid subcategry id for this id: ${subcategoryid}`)
            );
          }
        })
    )
    .custom((val, { req }) =>
      subcategory
        .find({ category: req.body.category })
        .then((subcategories) => {
          const subcategriesidinDB = [];
          subcategories.forEach((subCategory) => {
            subcategriesidinDB.push(subCategory._id.toString());
          });
          //check if subcategories ids in db include subcategories in req.body(true/false)
          if (!val.every((v) => subcategriesidinDB.includes(v))) {
            return Promise.reject(
              new Error(`subcategory not belong to category`)
            );
          }
        })
    ),
  check("brand").optional().isMongoId().withMessage("invalid ID format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("retingsAverge must be number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("retingsAverge must be number"),
  valditormiddlwares,
];

exports.updateproductval = [
  check("id").isMongoId().withMessage("invalid product id"),body("title").custom((val,{req})=>{
   req.body.slug=slugify(val);
   return true;
  }),
  valditormiddlwares,
];

exports.getproductval = [
  check("id").isMongoId().withMessage("invalid product id"),
  valditormiddlwares,
];

exports.deleteproductval = [
  check("id").isMongoId().withMessage("invalid product id"),
  valditormiddlwares,
];
