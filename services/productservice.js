const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { uploadmixedimages } = require("../middelware/uploadimagemidlleware");
const productschema = require("../models/productmodel");
const factory = require("./HandelrFactory");

exports.uploadproductimages = uploadmixedimages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeimage = asyncHandler(async (req, res, next) => {
  //image proccess for imagecover
  if (req.files.imageCover) {
    const imagecoverfilename = `products${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2200, 1500)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/products/${imagecoverfilename}`);
    //save image into db
    req.body.imageCover = imagecoverfilename;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(
        asyncHandler(async (img, index) => {
          //image proccessing
          const imagename = `products${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
          await sharp(img.buffer)
            .resize(2200, 1500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${imagename}`);
          req.body.images.push(imagename);
        })
      )
    );
    next();
  }

});


//@desc get list of all product
//@route get /api/v1/products
//@access public
exports.getproducts = factory.getall(productschema, "product");

//@desc get specific product by id
//@route get /api/v1/products:/id
//@access public
exports.getproduct = factory.getOne(productschema, "reviews");

//@ desc create product
//@ route post /api/v1/products
//@ access private/Admain-manger

exports.createproduct = factory.CreateOne(productschema);

//@desc update specifiec product
//@router put /api/v1/products/
//@access private/Admain-manger
exports.updateproduct = factory.updateOne(productschema);

//@Delete specific product
//@router Delete /api/v1/products
//access private/Admain

exports.deleteprodct = factory.deleteone(productschema);
