const asyncHandler = require("express-async-handler");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const factory = require("./HandelrFactory");
const { uploadsingleimage } = require("../middelware/uploadimagemidlleware");
const brandmodel = require("../models/brandmodel");

//upload single image
exports.uploadbrandsimage=uploadsingleimage("image")
//image process
exports.resizeimage = asyncHandler(async (req, res, next) => {
  const filename = `brands-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(1000, 1200)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`uploads/brands/${filename}`);
  //save image into our db
  req.body.image = filename;
  next();
});

//@desc get list of all brand
//@route get /api/v1/brands
//@access public
exports.getbrands = factory.getall(brandmodel);
//@desc get specific brand by id
//@route get /api/v1/brands:/id
//@access public

exports.getspecificbrand = factory.getOne(brandmodel);

//@ desc create brand
//@ route post /api/v1/brands
//@ access private/Admain-manger

exports.createbrand = factory.CreateOne(brandmodel);

//@desc update specifiec brand
//@router put /api/v1/brands/
//@access private/Admain-manger
exports.updatebrand = factory.updateOne(brandmodel);

//@Delete specific brand
//@router Delete /api/v1/brands
//access private/Admain

exports.deletebrand = factory.deleteone(brandmodel);
