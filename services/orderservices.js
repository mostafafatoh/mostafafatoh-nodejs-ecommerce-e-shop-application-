const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const factory = require("./HandelrFactory");
const Cart = require("../models/shopingCart");
const Order = require("../models/orderModel");
const Product = require("../models/productmodel");
const Apierror = require("../utiles/apierror");
const { strip } = require("colors");
const { concurrency } = require("sharp");

exports.filterUserorder = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterobject = { user: req.user._id };
  next();
});
//@ desc create order
//@ route post /api/v1/orders
//@ access protected/user

exports.Cashorder = asyncHandler(async (req, res, next) => {
  //app setting
  const taxtprice = 0;
  const shippingPrice = 0;

  //1-get cart based on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new Apierror(`cant find cart  with this id : ${req.params.cartId}`, 404)
    );
  }

  //2-get order price depended  cart price "check if apply coupon "
  const cartprice = cart.totalPriceAfterDisc
    ? cart.totalPriceAfterDisc
    : cart.totalCartPrice;
  const totalOrderPrice = cartprice + taxtprice + shippingPrice;

  //3-create order with default paymentmethod cash
  const order = await Order.create({
    user: req.user._id,
    cartIteam: cart.cartIteam,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4-after create order decrement product quantity,increment product sold
  if (order) {
    const bulkoption = cart.cartIteam.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkoption, {});

    //5-clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});

//@ desc get all order
//@ route get /api/v1/orders
//@ access protected/user/manger/Admin

exports.getallorder = factory.getall(Order);

//@ desc get order
//@ route get /api/v1/orders/:id
//@ access protected/user/manger/Admin

exports.getspecific = factory.getOne(Order);

//@ desc update order ispaid status
//@ route put /api/v1/orders/:id/pay
//@ access protected/manger/Admin

exports.UpdatePaidStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new Apierror(`there is no order with id :${req.params.id}`, 404)
    );
  }
  order.ispaid = true;
  order.paidAt = Date.now();
  //update paid status
  const updatedata = await order.save();
  res.status(200).json({ status: "success", data: updatedata });
});

//@ desc update order isdelivered status
//@ route put /api/v1/orders/:id/deliver
//@ access protected/manger/Admin

exports.UpdateDeliverStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new Apierror(`there is no order with id :${req.params.id}`, 404)
    );
  }
  order.isDeliverd = true;
  order.DeliveredAt = Date.now();
  //update deliver status
  const updatedeliver = await order.save();
  res.status(200).json({ status: "success", data: updatedeliver });
});

//@ desc get checkout session from strip and send it as response
//@ route put /api/v1/orders/checkout-session/:cartId
//@ access protected/user

exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
  //app setting
  const taxtprice = 0;
  const shippingPrice = 0;

  //get cart based on cartid
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(
      new Apierror(`cant find cart  with this id : ${req.params.cartId}`, 404)
    );
  }
  //2-get order price depended  cart price "check if apply coupon "
  const cartprice = cart.totalPriceAfterDisc
    ? cart.totalPriceAfterDisc
    : cart.totalCartPrice;
  const totalOrderPrice = cartprice + taxtprice + shippingPrice;

  //3-create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: `Order from ${req.user.name}`,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    client_reference_id: req.params.cartId,
    customer_email: req.user.email,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: "success", session });
});

exports.webhookCheckout = (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("create order here...");
    console.log(event.data.object.client_reference_id)
  }
};
