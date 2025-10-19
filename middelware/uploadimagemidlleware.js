// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
const Apierror = require("../utiles/apierror");

const multeroption = () => {
  //1-deskstorge engine
  // const multerstorage=multer.diskStorage({
  //     destination:function(req,file,cb){
  //         cb(null,'uploads/categories')
  //     },
  //     filename:function(req,file,cb){
  //         const ext=file.mimetype.split("/")[1];
  //         const filename=`category-${uuidv4()}-${Date.now()}.${ext}`;
  //         cb(null,filename);

  //     },
  // });

  const multerstorage = multer.memoryStorage();

  const multerfilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Apierror("only images allowed", 404), false);
    }
  };

  const upload = multer({ storage: multerstorage, fileFilter: multerfilter });
  return upload;
};

exports.uploadsingleimage = (filedname) => multeroption().single(filedname);

exports.uploadmixedimages = (arrrayofFileds) =>
  multeroption().fields(arrrayofFileds);
