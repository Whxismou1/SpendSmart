const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/checkAuth");
const upload = require("../config/multer.config");
const userRouter = express.Router();

userRouter.post(
  "/upload-profile-picture",
  verifyToken,
  upload.single("profilePicture"),
  userController.uploadProfilePicture
);

userRouter.post("/change-password", verifyToken, userController.changePassword);


module.exports = userRouter;
