const { check } = require("express-validator");
const slugify = require("slugify");
const User = require("../../models/UserModel");

const valditormiddlware = require("../../middelware/valditormiddlware");

exports.SignUpVal = [
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
    .withMessage("invalid Email address")
    .custom((val) => {
      return User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("email is use already"));
        }
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("Too short password must be at least 6 char")
    .custom((password, { req }) => {
      if (password != req.body.passwordconfirm) {
        throw new Error("password confirmation is not true");
      }
      return true;
    }),
  check("passwordconfirm")
    .notEmpty()
    .withMessage("password confirmation is required"),
  valditormiddlware,
];

exports.loginval = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 char "),
  valditormiddlware,
];
