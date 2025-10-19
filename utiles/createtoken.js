const jwt = require("jsonwebtoken");

const generatetoken = (payloadid, payloademail) => {
  return jwt.sign(
    { userid: payloadid, emailUser: payloademail },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );
};

module.exports = generatetoken;
