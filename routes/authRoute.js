const express = require("express");

const { SignUpVal, loginval } = require("../utiles/validator/authvalditor");

const {
  signUp,
  login,
  Forgetpassword,
  verifyresetCode,
  resetpassword,
} = require("../services/authservice");

const router = express.Router();

router.route("/signup").post(SignUpVal, signUp);
router.route("/login").post(loginval, login);
router.route("/forgetpassword").post(Forgetpassword);
router.route("/verifyResetcode").post(verifyresetCode);
router.route("/ResetnewPassword").put(resetpassword);
module.exports = router;
