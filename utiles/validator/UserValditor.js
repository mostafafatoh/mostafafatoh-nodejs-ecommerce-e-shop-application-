const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const slugify = require("slugify");
const valditormiddlware = require("../../middelware/valditormiddlware");
const User = require("../../models/UserModel");
exports.getUserval = [
  check("id").isMongoId().withMessage("invalid User id format"),
  valditormiddlware,
];

exports.createuserval = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("Too short name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email is use already"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password requird")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 char")
    .custom((password, { req }) => {
      if (password != req.body.passwordconfirm) {
        throw new Error("password confirmation is not true");
      }
      return true;
    }),
  check("passwordconfirm")
    .notEmpty()
    .withMessage("password confirm is required"),
  check("profileimage").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "ar-BH", "ar-AE", "ar-KW"])
    .withMessage("invalid mobile number"),
  check("role").optional(),
  valditormiddlware,
];

exports.updateUserval = [
  check("id").isMongoId().withMessage("invalid User id format"),
  check("name")
    .optional()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage(`too short brand name`)
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email is use already"));
        }
      })
    ),
  check("profileimage").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "ar-BH", "ar-AE", "ar-KW"])
    .withMessage("invalid mobile number"),
  check("role").optional(),
  valditormiddlware,
];

exports.changepasswordval = [
  check("id").isMongoId().withMessage("invalid user id format"),
  check("currentpassword")
    .notEmpty()
    .withMessage("you must enter current password"),
  check("passwordconfirm").notEmpty().withMessage("enter the confirm password"),
  check("password")
    .notEmpty()
    .withMessage("you must enter your new password")
    .custom(async (val, { req }) => {
      //1- verfiy current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }
      const iscorrectpassword = await bcrypt.compare(
        req.body.currentpassword,
        user.password
      );
      if (!iscorrectpassword) {
        throw new Error("incorrect current password");
      }

      //2- verfiy password confirm
      if (val != req.body.passwordconfirm) {
        throw new Error("password confirmtion incorrect");
      }
      return true;
    }),
  valditormiddlware,
];

exports.deleteUserval = [
  check("id").isMongoId().withMessage("invalid user id format"),
  valditormiddlware,
];

exports.updateloggedUserval = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage(`too short brand name`)
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email is use already"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA", "ar-BH", "ar-AE", "ar-KW"])
    .withMessage("invalid mobile number"),
  valditormiddlware,
];

exports.changeUserpasswordval = [
  check("currentpassword")
    .notEmpty()
    .withMessage("you must enter current password"),
  check("passwordconfirm").notEmpty().withMessage("enter the confirm password"),
  check("password")
    .notEmpty()
    .withMessage("you must enter your new password")
    .custom(async (val, { req }) => {
      //1- verfiy current password
      const user = await User.findById(req.user.id);
      if (!user) {
        throw new Error("there is no user for this id");
      }
      const iscorrectpassword = await bcrypt.compare(
        req.body.currentpassword,
        user.password
      );
      if (!iscorrectpassword) {
        throw new Error("incorrect current password");
      }

      //2- verfiy password confirm
      if (val != req.body.passwordconfirm) {
        throw new Error("password confirmtion incorrect");
      }
      return true;
    }),
  valditormiddlware,
];
