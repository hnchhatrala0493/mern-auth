import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/users.js";
import transporter from "../config/nodemailer.js";
import User from "../models/users.js";
import Otp from "../models/otp.js";

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

    return res.json({
      success: true,
      message: "Congratulation! User Registered Successfully",
    });
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
      message: "User Logging Successfully",
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
    if (user.isAccountVerifyOtp) {
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

export const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    console.log(user);

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Your OTP is ${otp}. Reset your password using this OTP`,
    };
    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "OTP Sent on registered Email.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired." });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    if (user.expireOtp < Date.now()) {
      return res.json({ success: false, message: "OTP Expired." });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    const text =
      "We wanted to let you know that your password has been successfully reset. If you made this change, no further action is required.";

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your Password Has Been Successfully Reset.",
      text: text,
    };
    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "Password Reset Successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
/* send forgot password otp */
export const sendForgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const otpInfo = {
      otp: otp,
      isUsed: false,
      email: email,
      expireOtp: Date.now() + 15 * 60 * 1000,
    };

    await Otp.create(otpInfo);

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Forgot Password OTP",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
        <h2 style="color: #007bff;">Forgot Password OTP</h2>
        <p>Your OTP for resetting your password is:</p>
        <h1 style="background-color: #f8f9fa; padding: 10px; display: inline-block; border-radius: 5px; color: #d9534f;">
          ${otp}
        </h1>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <hr>
        <p>If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your Company Name</p>
      </div>`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "OTP Sent on registered Email.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifiedOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const otpInfo = {
      otp: otp,
      isUsed: false,
      email: email,
      expireOtp: Date.now() + 15 * 60 * 1000,
    };

    await Otp.create(otpInfo);

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Forgot Password OTP",
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
        <h2 style="color: #007bff;">Forgot Password OTP</h2>
        <p>Your OTP for resetting your password is:</p>
        <h1 style="background-color: #f8f9fa; padding: 10px; display: inline-block; border-radius: 5px; color: #d9534f;">
          ${otp}
        </h1>
        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        <hr>
        <p>If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Your Company Name</p>
      </div>`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "OTP Sent on registered Email.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const otpInfo = {
      otp: otp,
      isUsed: false,
      email: email,
      expireOtp: Date.now() + 15 * 60 * 1000,
    };

    await Otp.create(otpInfo);

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Forgot Password OTP",
      text: `Your OTP is <strong>${otp}</strong>. Reset your password using this OTP`,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "OTP Sent on registered Email.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
