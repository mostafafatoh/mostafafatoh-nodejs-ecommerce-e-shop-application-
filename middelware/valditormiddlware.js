//@desc finds the valditors errors in this request and warps them in an object with handy
const { validationResult } = require("express-validator");

const valditormiddlware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = valditormiddlware;
