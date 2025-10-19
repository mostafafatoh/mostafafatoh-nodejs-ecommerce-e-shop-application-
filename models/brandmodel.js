const mongoose = require("mongoose");

const brandschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "must be unique"],
      minlength: [3, "too short brand name"],
      maxlength: [34, "too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

brandschema.post('init',(doc)=>{
  if(doc.image){
    const imageURL=`${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image=imageURL;
  }
})

brandschema.post('save',(doc)=>{
  const imageURL=`${process.env.BASE_URL}/brands/${doc.image}`;
  doc.image=imageURL;
})
const brandmodel = mongoose.model("brand", brandschema);
module.exports = brandmodel;
