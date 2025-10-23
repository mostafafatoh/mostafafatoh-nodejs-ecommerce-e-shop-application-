const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const ratelimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");

dotenv.config({ path: "config.env" });
const DBconnection = require("./config/database");
const Apierror = require("./utiles/apierror");
const globalerror = require("./middelware/errormiddelware");
const { webhookCheckout } = require("./services/orderservices");
const mountRoutes = require("./routes");
//connect DB

DBconnection();

//express app
const app = express();

//check out weebhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);
//enable other domain to access your application
app.use(cors());
// app.options(/.*/, cors());

// compress all responses
app.use(compression());

// cookie parser for CSRF
app.use(cookieParser());

//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// to apply data sanatization
app.use((req, res, next) => {
  try {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.query) req.query = mongoSanitize.sanitize(req.query);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
  } catch (err) {
    console.error("Sanitization error:", err.message);
  }
  next();
})
// prevent XSS attacks
app.use(xss());

// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "too many accounts created from this ip,please try again after 15m ",
});
app.use("/api/v1/auth/ResetnewPassword", limiter);

// middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsQuantity",
      "ratingsAverage",
    ],
  })
);

// setup CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

app.use((req, res, next) => {
  if (["POST", "PUT", "DELETE"].includes(req.method)) {
    return csrfProtection(req, res, next);
  }
  next();
});
// endpoint to send CSRF token to frontend

//  endpoint to get token
app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});
//mount routes
mountRoutes(app);

app.use((req, res, next) => {
  next(new Apierror(`can't find this route: ${req.originalUrl}`, 400));
});

//global error handling middleware for express
app.use(globalerror);
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, (req, res, next) => {
  console.log(`server run on port ${PORT}`);
});

//Handle Rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejectiion Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
