const mongoose = require("mongoose");

//1-create schema
const categoryschema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "too short Category name"],
      maxlength: [35, "too long Category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setimageURL=(doc)=>{
  if(doc.image){
    const imageURL=`${process.env.BASE_URL}/categories/${doc.image}`; 
    doc.image=imageURL;
  };
};

categoryschema.post('init', (doc)=> {
  //return image base url + image name 
  setimageURL(doc)
});

categoryschema.post('save',(doc)=>{
  setimageURL(doc)
});
//2-create model
const Categorymodel = mongoose.model("Category", categoryschema);

module.exports = Categorymodel;
