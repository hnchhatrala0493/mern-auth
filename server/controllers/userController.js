import UserModel from "../models/users.js";

export const UserDetails = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User Not Found." });
    }

    return res.json({
      success: true,
      userDetails: {
        name: user.name,
        email: user.email,
        isAccountVerify: user.isAccountVerify ? "Verified" : "Not Verify",
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
