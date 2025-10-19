const express = require("express");
const {
  addAddress,
  deleteAddresses,
  getallUserAddress,
} = require("../services/address");
const Authorization = require("../services/authservice");

const router = express.Router();
router.use(Authorization.protect, Authorization.allowedToaccess("user"));

router.route("/").post(addAddress).get(getallUserAddress);
router.route("/:addressId").delete(deleteAddresses);

module.exports = router;
