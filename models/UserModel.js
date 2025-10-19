const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "username is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileimage: String,
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordhashresetcode: String,
    passwordresetcodeexpired: Date,
    passwordResetverify: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "manger"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    //child reference(one to many)
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: {
          type: String,
          required: [true, "Address alias is required"],
          trim: true,
          minlength: [2, "Alias must be at least 2 characters"],
          maxlength: [50, "Alias too long"],
        },
        details: {
          type: String,
          required: [true, "Address details are required"],
        },
        phone: { type: String, required: [true, "Phone number is required"] },
        city: { type: String, required: [true, "City is required"] },
        postcode: {
          type: String,
          required: [true, "Postcode is required"],
        },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //Hashing password
  this.password = await bcrypt.hash(this.password, 14);
  next();
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
