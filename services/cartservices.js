const asyncHandler = require("express-async-handler");
const Apierror = require("../utiles/apierror");
const Product = require("../models/productmodel");
const Coupon = require("../models/coupon");
const Cart = require("../models/shopingCart");

const productTotalPrice = (cart) => {
  let totalprice = 0;
  cart.cartIteam.forEach((iteam) => {
    totalprice += iteam.price * iteam.quantity;
  });
  cart.totalCartPrice = totalprice;
  cart.totalPriceAfterDisc=undefined;
  return totalprice;
};

//@ desc add product to cart
//@ route post /api/v1/cart
//@ access private/user

exports.addProductToUserCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  //Get cart for logged user
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    //creat cart to logged user with product
    cart = await Cart.create({
      user: req.user.id,
      cartIteam: [{ product: productId, color, price: product.price }],
    });
  } else {
    //product exist in cart ,update product quantity
    const productindex = cart.cartIteam.findIndex(
      (iteam) => iteam.product.toString() === productId && iteam.color === color
    );
    if (productindex > -1) {
      const cartiteam = cart.cartIteam[productindex];
      cartiteam.quantity += 1;
      cart.cartIteam[productindex] = cartiteam;
    } else {
      //if product is not exists ,push new product on cartiteam
      cart.cartIteam.push({ product: productId, color, price: product.price });
    }
  }
  productTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "product added to cart successfully",
    data: cart,
  });
});

//@ desc get logged user cart
//@ route GET /api/v1/item
//@ access private/user
exports.getloggedCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    next(new Apierror(`there is no cart for this id: ${req.user.id}`, 404));
  }
  res.status(200).json({
    status: "success",
    numofCartIteam: cart.cartIteam.length,
    data: cart,
  });
});

//@ desc remove iteam from cart
//@ route Delete /api/v1/cart/:itemid
//@ access private/user
exports.removeiteamfromcart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartIteam: { _id: req.params.itemId } } },
    { new: true }
  );
  if (!cart) {
    return next(new Error("Cart not found for this user"));
  }
  productTotalPrice(cart);
  cart.save();

  res.status(201).json({
    status: "success",
    message: "product removed from cart successfully",
    numofCartIteam: cart.cartIteam.length,
    data: cart,
  });
});

//@ desc clear  cart
//@ route Delete /api/v1/cart/
//@ access private/user

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.status(204).send();
});

//@ desc update  cart iteam quantity
//@ route put /api/v1/cart/:itemid
//@ access private/user

exports.updatecartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new Apierror(`there is no cart for this id: ${req.params.itemId}`, 404)
    );
  }
  const iteamindex = cart.cartIteam.findIndex(
    (iteam) => iteam._id.toString() === req.params.itemId
  );
  if (iteamindex > -1) {
    const cartiteam = cart.cartIteam[iteamindex];
    cartiteam.quantity = quantity;
    cart.cartIteam[iteamindex] = cartiteam;
  } else {
    return next(
      new Apierror(`there is no item for this id: ${req.params.itemId}`, 404)
    );
  }
  productTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numofCartIteam: cart.cartIteam.length,
    data: cart,
  });
});

exports.applycoupon = asyncHandler(async (req, res, next) => {
  //get coupon basen on name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new Apierror(`invalid or expired coupon`));
  }
  const cart = await Cart.findOne({ user: req.user.id });

  const totalprice = cart.totalCartPrice || 0;

  const priceafterdiscount = (
    totalprice -
    (totalprice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDisc = priceafterdiscount;
  await cart.save();
  res.status(200).json({
    status: "success",
    numofCartIteam: cart.cartIteam.length,
    data: cart,
  });
});
