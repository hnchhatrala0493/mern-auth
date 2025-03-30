import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/users.js";
import transporter from "../config/nodemailer.js";
import User from "../models/users.js";

export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.json({ message: "User Already taken" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hashPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome",
      text: "Welcome",
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(201).json({
      success: true,
      token: token,
      message: "Logging Successfully",
    });
  } catch (error) {
    return res.json({ success: true, message: error.message });
  }
};
export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const sendVerifyOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.expireOtp = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };
    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "Verification OTP Sent on Email.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.expireOtp < Date.now()) {
      return res.json({ success: false, message: "OTP Expired." });
    }
    user.isAccountVerifyOtp = true;
    user.verifyOtp = "";
    user.expireOtp = 0;
    await user.save();
    return res.json({ success: true, message: "Email Verified Successfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const UserDetails = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User Not Found." });
    }

    return res.json({
      success: true,
      userDetails: {
        name: user.name,
        email: user.email,
        isAccountVerify: user.isAccountVerifyOtp,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
