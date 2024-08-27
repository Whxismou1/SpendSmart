const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserModel = require("../models/user.model");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../config/mail.config");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const userEmailExistOnDB = await UserModel.findOne({ email });
    if (userEmailExistOnDB) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists!" });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000,
    });

    await user.save();

    await sendVerificationEmail(email, verificationToken);

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
      sameSite: "strict",
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
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.accountActivated = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

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

module.exports = { register, login, verifyEmail };
