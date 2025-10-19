const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

//@desc add product to wishlist
//@route post /api/v1/wishlist
//@access protected/user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  //addToSet=> add productid to wishlist array if productid not exists
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product added successfully to your wishlist",
    data: user.wishlist,
  });
});

//@desc remove product from wishlist
//@route delete /api/v1/wishlist/:productid
//@access protected/user

exports.deleteProductFromWishlist = asyncHandler(async (req, res, next) => {
  //$pull=> remove productid from wishlist array if productid  exists
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product removed successfully from your wishlist",
    data: user.wishlist,
  });
});

//@desc GET logged user wishlist
//@route GET /api/v1/wishlist/
//@access protected/user

exports.getallwishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("wishlist");

  res
    .status(200)
    .json({
      status: "success",
      results: user.wishlist.length,
      data: user.wishlist,
    });
});
