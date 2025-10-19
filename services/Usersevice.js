const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const factory = require("./HandelrFactory");
const { uploadsingleimage } = require("../middelware/uploadimagemidlleware");
const generatetoken = require("../utiles/createtoken");
const Apierror = require("../utiles/apierror");
const UserModel = require("../models/UserModel");

//upload profileimage
exports.uploadsingleimage = uploadsingleimage("profileimage");

//proccess profileimage
exports.resizeimage = asyncHandler(async (req, res, next) => {
  const filename = `Users-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(2000, 1500)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/Users/${filename}`);
    req.body.profileimage = filename;
  }
  next();
});

//@desc get list of all User
//@route get /api/v1/Users
//@access private/Admain
exports.getUsers = factory.getall(UserModel);
//@desc get specific User by id
//@route get /api/v1/Users:/id
//@access private/Admain

exports.getUser = factory.getOne(UserModel);

//@ desc create User
//@ route post /api/v1/Users
//@ access private/Admain

exports.createUser = factory.CreateOne(UserModel);

//@desc update specifiec User
//@router put /api/v1/Users/
//@access private/Admain
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      slug: req.body.slug,
      role: req.body.role,
      profileimage: req.body.profileimage,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  if (!document)
    return next(
      new Apierror(`invalid document id for this id: ${req.params.id}`, 404)
    );
  res.status(200).json({ data: document });
});

exports.ChangeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 13),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document)
    return next(
      new Apierror(`invalid document id for this id: ${req.params.id}`, 404)
    );
  res.status(200).json({ data: document });
});
//@Delete specific User
//@router Delete /api/v1/Users
//access private/Admain

exports.deleteUser = factory.deleteone(UserModel);

//@desc get logged user data
//@route get /api/v1/Users/getMe
//@access private/protected

exports.getloggedUseData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

//@desc update logged user password
//@route get /api/v1/Users/updatemypassword
//@access private/protected

exports.updateloggedpassword = asyncHandler(async (req, res, next) => {
  //get user password based on user payload(req.user.id)
  const user = await UserModel.findByIdAndUpdate(
    req.user.id,
    {
      password: await bcrypt.hash(req.body.password, 13),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  //2-generate token
  const token = generatetoken(user.id, user.email);
  res.status(200).json({ data: user, token });
});

//@desc update logged user data
//@route get /api/v1/Users/changedUserData
//@access private/protected

exports.updateloggedUserData = asyncHandler(async (req, res, next) => {
  const updateuser = await UserModel.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email, phone: req.body.phone },
    { new: true }
  );
  res.status(200).json({ data: updateuser });
});


//@desc Deactive logged user 
//@route Delete /api/v1/Users/DeactiveUser
//@access private/protected

exports.deactiveUser = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204);
});


//@desc Active user 
//@route put /api/v1/Users/ActiveUser
//@access private/protected

//exports.activeuser=asyncHandler(async(req,res,next)=>{
//   await UserModel.findByIdAndUpdate(req.user.id,{active:true})
//   res.status(200)
// })