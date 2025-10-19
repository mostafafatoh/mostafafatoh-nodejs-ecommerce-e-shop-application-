const categoryroute = require("./categoryroutes");
const brandroute = require("./brandroutes");
const subcategoryroute = require("./subcategryroute");
const productroute = require("./productRoute");
const UsersRoute = require("./UserRoute.JS");
const authRoute = require("./authRoute.js");
const reviewRoute = require("./ReviewsRoutes.js");
const wishlistRoute = require("./wishlistRoute.js");
const addressRoute = require("./addressRoute");
const CouponRoute = require("./CouponRoute");
const CartRoute = require("./CartRoute");
const orderRoute = require("./orderRoute.js");
const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryroute);
  app.use("/api/v1/subcategories", subcategoryroute);
  app.use("/api/v1/brands", brandroute);
  app.use("/api/v1/products", productroute);
  app.use("/api/v1/Users", UsersRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", CouponRoute);
  app.use("/api/v1/cart", CartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoutes;
