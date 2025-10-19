const factory = require("./HandelrFactory");
const Coupon = require("../models/coupon");

//@desc get  all Coupon
//@route GET /api/v1/Coupons
//@access private/Admin-Manger
exports.getCoupons = factory.getall(Coupon);

//@desc get specific Coupon by id
//@route GET /api/v1/Coupons:/id
//@access private/Admin-Manger

exports.getCoupon = factory.getOne(Coupon);

//@ desc create Coupon
//@ route post /api/v1/Coupons
//@access private/Admin-Manger

exports.createCoupon = factory.CreateOne(Coupon);

//@desc update specifiec Coupon
//@router put /api/v1/Coupons/:id
//@access private/Admain-manger

exports.updateCoupon = factory.updateOne(Coupon);

//@Delete specific Coupon
//@router Delete /api/v1/Coupons/:id
//@access private/Admin-Manger

exports.deleteCoupon = factory.deleteone(Coupon);
