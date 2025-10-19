const mongoose = require("mongoose");

const product = require("./productmodel");
const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    //parent reference (one to many) 
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

//mongoose query middleware
ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

ReviewSchema.statics.averageRatingAndTotalQuantity = async function (
  productId
) {
  const result = await this.aggregate([
  //stage 1: get all reviews in specific product
    {
      $match: { product: productId },
    },
    //stage 2:Grouping reviews based on productId and calculate averagerating and ratingquantity 
    {
      $group: {
        _id: "$product",
        avgratings: { $avg: "$ratings" },
        ratingquantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgratings,
      ratingsQuantity: result[0].ratingquantity,
    });
  } else {
    await product.findByIdAndUpdate(product, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.averageRatingAndTotalQuantity(this.product);
});

ReviewSchema.post ("deleteOne",{document:true,query:false},async function(){
  await this.constructor.averageRatingAndTotalQuantity(this.product)
})
module.exports = mongoose.model("Review", ReviewSchema);
