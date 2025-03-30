import express from "express";
import {
  Login,
  Register,
  UserDetails,
  Logout,
  sendVerifyOTP,
  verifyEmail,
  isAuthenticated,
} from "../controllers/LoginController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/login", Login);
authRouter.post("/register", Register);
authRouter.get("/details", userAuth, UserDetails);
authRouter.post("/logout", Logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOTP);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);

export default authRouter;
