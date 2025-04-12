import express from "express";
import { body } from "express-validator";
import {
  Login,
  Register,
  Logout,
  sendVerifyOTP,
  verifyEmail,
  isAuthenticated,
  resetPassword,
  sendResetOTP,
  sendForgotPasswordOTP,
  verifiedOTP,
  changePassword,
  ProfileUpdate,
} from "../controllers/LoginController.js";

import { UserDetails } from "../controllers/userController.js";

import userAuth from "../middleware/userAuth.js";
import message from "../helper/message.js";
import { passwordValidateRule } from "../helper/passwordValidateRules.js";

const authRouter = express.Router();

authRouter.post(
  "/login",
  body("email")
    .not()
    .isEmpty()
    .withMessage(message.User.EMAIL)
    .isEmail()
    .withMessage(message.User.INVALID_EMAIL),
  body("password").not().isEmpty().withMessage(message.PASSWORD.PASSWORD),
  // Validate,
  Login
);
authRouter.post("/register", Register);
authRouter.get("/details", userAuth, UserDetails);
authRouter.post("/logout", Logout);

/* verify otp for verify email */
authRouter.post("/send-verify-otp", sendVerifyOTP);
authRouter.post("/verify-account", userAuth, verifyEmail);

authRouter.get("/is-auth", userAuth, isAuthenticated);
/* for reset password */
authRouter.post("/reset-password", userAuth, resetPassword);
authRouter.post("/send-reset-otp", userAuth, sendResetOTP);
/* for forgot password */
authRouter.post("/send-forgot-password-otp", sendForgotPasswordOTP);
authRouter.post(
  "/verify-otp",
  body("otp")
    .not()
    .isEmpty()
    .withMessage(message.OTP.OTP)
    .isNumeric()
    .withMessage(message.OTP.NUMBER_OTP),
  verifiedOTP
);
authRouter.post(
  "/change-password",
  body("newPassword")
    .not()
    .isEmpty()
    .withMessage(message.PASSWORD.NEW_PASSWORD),
  passwordValidateRule,
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage(message.Validation_Error.PASSWORD),
  passwordValidateRule,
  changePassword
);

// authRouter.put("/profile-update", userAuth, ProfileUpdate);

export default authRouter;
