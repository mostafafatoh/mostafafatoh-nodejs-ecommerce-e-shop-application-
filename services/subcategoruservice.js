const subcategorymodel = require("../models/subcategorymodel");
const factory = require("./HandelrFactory");

//nested route for create
exports.setcategoryIdtoBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//@nested route create
//@GET api/v1/category/categoryid/subcategories
//@desc get list of all subcategory
//@route get /api/v1/subcategories
//@access public
exports.createfiltecategory = (req, res, next) => {
  let filterobject = {};
  if (req.params.categoryId) filterobject = { category: req.params.categoryId };
  req.filterobject = filterobject;
  next();
};

exports.getsubcategories = factory.getall(subcategorymodel);

//@desc get specific subcategory by id
//@route get /api/v1/subcategories:/id
//@access public

exports.getsubcategory = factory.getOne(subcategorymodel);

//@ desc create subcategory
//@ route post /api/v1/subcategories
//@ access private/Admain-manger

exports.createsubcategory = factory.CreateOne(subcategorymodel);

//@desc update specifiec subcategory
//@router put /api/v1/subcategories/
//@access private/Admain-manger

exports.updatesubcategory = factory.updateOne(subcategorymodel);

//@Delete specific subcategry
//@router Delete /api/v1/aubcategories
//access private/Admain

exports.deletesubcategory = factory.deleteone(subcategorymodel);
