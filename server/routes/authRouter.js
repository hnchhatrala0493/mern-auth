import express from "express";
import {
  Login,
  Register,
  UserDetails,
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
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/login", Login);
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
authRouter.post("/verify-otp", verifiedOTP);
authRouter.post("/change-password", changePassword);

authRouter.put("/profile-update", userAuth, ProfileUpdate);

export default authRouter;
