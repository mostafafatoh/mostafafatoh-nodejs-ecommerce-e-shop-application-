const express = require("express");
const {
  getUserval,
  createuserval,
  updateUserval,
  deleteUserval,
  changepasswordval,
  updateloggedUserval,
  changeUserpasswordval,
} = require("../utiles/validator/UserValditor");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadsingleimage,
  resizeimage,
  ChangeUserPassword,
  getloggedUseData,
  updateloggedpassword,
  updateloggedUserData,
  deactiveUser,
  activeuser,
} = require("../services/Usersevice");

const Authorization = require("../services/authservice");

const router = express.Router();


router.use(Authorization.protect);


router.route("/getMe").get(getloggedUseData, getUser);
router
  .route("/changemypassword")
  .put(changeUserpasswordval, updateloggedpassword);

router.route("/changedUserData").put(updateloggedUserval, updateloggedUserData);

router.route("/Deactive").delete(deactiveUser);

// router.route("/Active").patch(activeuser);

router.use(Authorization.allowedToaccess("admin"));

//change password route
router.route("/changepassword/:id").put(changepasswordval, ChangeUserPassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadsingleimage, resizeimage, createuserval, createUser);
router
  .route("/:id")
  .get(getUserval, getUser)
  .put(uploadsingleimage, resizeimage, updateUserval, updateUser)
  .delete(deleteUserval, deleteUser);

module.exports = router;
