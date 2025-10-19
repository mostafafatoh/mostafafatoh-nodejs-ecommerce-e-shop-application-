const factory = require("./HandelrFactory");
const reviewmodel = require("../models/reviewModel");

//@nested route create
//@GET api/v1/products/:productId/reviews
exports.createfilterproduct = (req, res, next) => {
  let filterobject = {};
  if (req.params.productId) filterobject = { product: req.params.productId };
  req.filterobject = filterobject;
  next();
};

//@desc get list of all reivews
//@route get /api/v1/reivews
//@access public
exports.getreivews = factory.getall(reviewmodel);
//@desc get specific reivew by id
//@route get /api/v1/reivews:/id
//@access public

exports.getreivew = factory.getOne(reviewmodel);



//nested route
exports.setproductidandUserIdToBody=(req,res,next)=>{
    if(!req.body.product) req.body.product=req.params.productId
    if(!req.body.user) req.body.user=req.user.id
    next();
}

//@ desc create reivew
//@ route post /api/v1/reivews
//@ access private/protected/user

exports.createreivew = factory.CreateOne(reviewmodel);

//@desc update specifiec reivew
//@router put /api/v1/reivews/
//@access private/protected/user
exports.updatereivew = factory.updateOne(reviewmodel);

//@Delete specific reivew
//@router Delete /api/v1/reivews
//access private/protected/user-Admin-manger

exports.deletereivew = factory.deleteone(reviewmodel);
