const mongoose = require("mongoose");

const productschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "too short product title"],
      maxlength: [100, "too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minlength: [20, "too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      max: [20000000, "too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    //to enable virttuals populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productschema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name-__id" });
  next();
});

const setimagesURL = (doc) => {
  if (doc.imageCover) {
    const imagesURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imagesURL;
  }
  if (doc.images) {
    const imagelist = [];
    doc.images.forEach((image) => {
      const imagesURL = `${process.env.BASE_URL}/products/${image}`;
      imagelist.push(imagesURL);
    });
    doc.images = imagelist;
  }
};

productschema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productschema.post("init", (doc) => {
  setimagesURL(doc);
});

productschema.post("save", (doc) => {
  setimagesURL(doc);
});

module.exports = mongoose.model("Product", productschema);
