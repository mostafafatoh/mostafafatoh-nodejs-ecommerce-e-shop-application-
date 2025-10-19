const Apierror = require("../utiles/apierror");

const send_in_dev_mode = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const send_in_prod_mode = (err, res) => {
  // operational errors only
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

const handleInvalidTokenSignature = () => {
  return new Apierror("Invalid token, please try to log in again...", 401);
};

const handleExpiredToken = () => {
  return new Apierror("Expired token, please log in again...", 401);
};

const globalerror = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    send_in_dev_mode(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleInvalidTokenSignature();
    if (err.name === "TokenExpiredError") err = handleExpiredToken();
    send_in_prod_mode(err, res);
  }
};

module.exports = globalerror;
