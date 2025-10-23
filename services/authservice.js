const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utiles/sendEmail");
const generatetoken = require("../utiles/createtoken");
const {sanitizeUser} = require("../utiles/sanitizeData");
const User = require("../models/UserModel");
const ApiError = require("../utiles/apierror");

//@desc  signUp
//@route post /api/v1/auth/signUp
//@access public

exports.signUp = asyncHandler(async (req, res, next) => {
  //create User
  const User = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  console.log(req.body);

  //generate token
  const token = generatetoken(User._id, User.email);
  //send res to client side
  res.status(201).json({ data: sanitizeUser(User), token });
});

//@desc  login
//@route post /api/v1/auth/login
//@access public

exports.login = asyncHandler(async (req, res, next) => {
  //1-check if password and email in the body(valditor)
  //2-check if user exist &check if password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }

  //3-generate token
  const token = generatetoken(user._id, user.email);
  res.status(200).json({ data: sanitizeUser(user), token });
});

/// desc check if user is logged in

exports.protect = asyncHandler(async (req, res, next) => {
  //1-check if token exists,if exist get into
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not logged in. Please log in to get access.", 401)
    );
  }

  //2-verfiy token(no change happen,check expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //3-check if user exists
  const currentUser = await UserModel.findById(decoded.userid);
  if (!currentUser) {
    return next(new ApiError("This user no longer belongs to this token", 401));
  }

  // if user is active
  // if (!currentUser.active) {
  //   return next(
  //     new Apierror("can not access because this user is deactive", 404)
  //   );
  // }

  //4-check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          " User recently changed password. Please log in again.",
          401
        )
      );
    }
  }
  req.user = currentUser;

  next();
});

//@desc Authrezation (User permissions)
exports.allowedToaccess = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access roles
    //2-access register users
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

exports.Forgetpassword = asyncHandler(async (req, res, next) => {
  //1-Get User by Email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user for this email ${req.body.email}`, 404)
    );
  }
  //2-if user exist,generate 6 random digits as hash reset code and save it in db
  const resetcode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashRestCode = crypto
    .createHash("sha256")
    .update(resetcode)
    .digest("hex");
  //save hash reset code into db
  user.passwordhashresetcode = hashRestCode;
  //add expired date for reset code
  user.passwordresetcodeexpired = Date.now() + 15 * 60 * 1000;
  user.passwordResetverify = false;

  await user.save();
  //3-send the reset code via email
  const message = `HI ${user.name}\n WE recevied your request to reset password in your account.\n ${resetcode} \n Enter this number to complete your reset.\n Thanks for helping us keep your account secure `;
  try {
    await sendEmail({
      email: user.email,
      subject: `your password reset code (valid for 15 minaute)`,
      message,
    });
  } catch (err) {
    user.passwordhashresetcode = undefined;
    user.passwordresetcodeexpired = undefined;
    user.passwordResetverify = undefined;
    await user.save();
    return next(new ApiError("there is error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "reset code was send to email" });
});

//@desc  verfiy password
//@route post /api/v1/auth/verifyResetcode
//@access public

exports.verifyresetCode = asyncHandler(async (req, res, next) => {
  //1-get user based on reset code
  const hashRestCode = crypto
    .createHash("sha256")
    .update(req.body.resetcode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordhashresetcode: hashRestCode,
    passwordresetcodeexpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }
  //2-reset code verify
  user.passwordResetverify = true;
  await user.save();

  res.status(200).json({ status: "success" });
});

exports.resetpassword = asyncHandler(async (req, res, next) => {
  //1-get user by email
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`there is no user for this email ${req.body.email}`, 404)
    );
  }
  //2- check if reset code verified
  if (!user.passwordResetverify) {
    return next(new ApiError("reset code is not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordhashresetcode = undefined;
  user.passwordresetcodeexpired = undefined;
  user.passwordResetverify = undefined;

  await user.save();
  //3-if confirm the new password, generate new token
  const token = generatetoken(user._id, user.email);

  res.status(200).json({ token });
});
