import express from "express";
const router = express.Router();

import {
 signup,
 login,
 logout,
 protect,
 updatePassword,
 restrictTo,
 forgotPassword,
  resetPassword,
  sendConfirmation,
 confirmEmail
} from "./../controllers/authController.js";
import {
 deleteUser,
 deleteMe,
 getAllUsers,
 getMe,
 getUser,
 resizeUserPhoto,
 updateMe,
 updateUser,
 uploadUserPhoto,
} from "../controllers/userController.js";

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.post("/sendConfirmation", sendConfirmation); 
router.get("/confirmEmail/:token", confirmEmail);

// router.post("/forgotPassword", forgotPassword);
// router.patch("/resetPassword/:token", resetPassword);

// router.post("/sendConfirmation", protect, sendConfirmation); // user = req.user from protect works as document so it deals with the instance methods
// router.get("/confirmEmail/:token", confirmEmail);

// this is gonna work as a Middelware so, anything after this is gonne be protected
router.use(protect); 

router.patch("/updateMyPassword/", updatePassword);

router.get("/me", getMe, getUser);
router.patch("/updateMe/", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe/", deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
