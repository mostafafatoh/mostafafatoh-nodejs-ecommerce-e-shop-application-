const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

//@desc add Addresses to user
//@route post /api/v1/Addresses
//@access protected/user

exports.addAddress = asyncHandler(async (req, res, next) => {
  //addToSet=> add Addresses object to Addresses array in user

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { addresses: req.body } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address added successfully to user",
    data: user.addresses,
  });
});
//@desc remove Addresses from user
//@route delete /api/v1/Addresses/:Addressesid
//@access protected/user

exports.deleteAddresses = asyncHandler(async (req, res, next) => {
  //$pull=> remove Addresses object from Addresses array
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { addresses:{ _id:req.params.addressId} } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "address deleted successfully from user",
    data: user.addresses,
  });
});

//@desc GET logged user Addresses
//@route GET /api/v1/Addresses/
//@access protected/user

exports.getallUserAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("addresses");
  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
