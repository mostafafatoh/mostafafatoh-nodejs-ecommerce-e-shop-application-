const asyncHandler = require("express-async-handler");

const { v4: uuidv4 } = require("uuid");

// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const factory = require("./HandelrFactory");
const { uploadsingleimage } = require("../middelware/uploadimagemidlleware");
const Categorymodel = require("../models/categorymodels");

//upload single image
exports.uploadcategoryimage = uploadsingleimage("image");

//image process
exports.resizeimage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(1000, 1200)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/categories/${filename}`);
    //save image into our db
    req.body.image = filename;
  }
  next();
});

//@desc get list of all Categories
//@route get /api/v1/Categories
//@access public
exports.getcategories = factory.getall(Categorymodel);

//@desc get specific Category
//@route get /api/v1/Categories
//@access public
exports.getcategory = factory.getOne(Categorymodel);

//@desc create Categories
//@route post /api/v1/Categories
//@access private/Admain-manger
exports.creatCategory = factory.CreateOne(Categorymodel);

//@desc update Categories
//@route put /api/v1/Categories
//@access private/Admain-manger
exports.updateCategory = factory.updateOne(Categorymodel);

//@desc delete specifc Category
//@route delete /api/v1/Categories
//@access private/Admain
exports.DeleteCategory = factory.deleteone(Categorymodel);
