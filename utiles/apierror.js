//@desc this calss is responsible about operation error(predict error)
class Apierror extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? `fail` : `error`;
    this.isOperational = true;
  }
}

module.exports = Apierror;
