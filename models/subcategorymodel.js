const mongoose = require("mongoose");

const subcategoryschema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subcategory must be unique"],
      minlength: [2, "too short subcategory name"],
      maxlength: [35, "too long subcategory name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "subcategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

const subcategorymodel = mongoose.model("subcategory", subcategoryschema);

module.exports = subcategorymodel;
