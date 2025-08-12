const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const UserModel = require("../models/user.model");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordRequest,
  sendPasswordResetSucces,
} = require("../config/mail.config");

const register = async (req, res) => {
  const { name, email, password, confirmPassword, birthdate, currency } =
    req.body;
  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !birthdate ||
    !currency
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
  if (age < 14) {
    return res.status(400).json({
      success: false,
      message: "Incorrect date of birth.",
    });
  }

  try {
    const userEmailExistOnDB = await UserModel.findOne({ email });
    if (userEmailExistOnDB) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists!" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiresAt: Date.now() + 15 * 60 * 1000,
      dateOfBirth: birthdate,
      currency,
    });
    console.log(user);
    await user.save();
    console.log("user saved");
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in register ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const userOnDB = await UserModel.findOne({ email });

    if (!userOnDB) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPassValid = await bcrypt.compare(password, userOnDB.password);

    if (!isPassValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const userId = userOnDB._id;

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...userOnDB._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in login ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;

  try {
    const user = await UserModel.findOne({
      verificationCode: verificationCode,
      verificationCodeExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.accountActivated = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If the email is registered, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    const url = process.env.FRONTEND_URL + "/reset-password/" + resetToken;

    await sendResetPasswordRequest(user.email, url);
    return res.status(200).json({
      success: true,
      message:
        "If the email is registered, a password reset link has been sent.",
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  console.log(resetToken, password);
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();
    await sendPasswordResetSucces(user.email);
    res.status(200).json({ success: true, message: "sss" });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res
      .status(500)
      .json({ success: false, message: "Password reset successful" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("jwt_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

const checkAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userID).select("-password");

    if (!user) {
      res.status(404).json({ success: true, message: "Something went wrong" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("error in checkauth ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Password didnt match " });
    }

    const user = await UserModel.findById(req.userID);

    if (!user) {
      return res.status(400).json({ message: "Invalid operation." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;

    await user.save();
    return res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
  checkAuth,
  changePassword,
};
