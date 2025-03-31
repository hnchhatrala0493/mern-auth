import mongoose from "mongoose";

const OTPSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      required: true,
      default: false,
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    expireOtp: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("OTP", OTPSchema);

export default Otp;
