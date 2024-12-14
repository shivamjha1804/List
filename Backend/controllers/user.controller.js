const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { generate } = require("otp-generator");

module.exports.signUpUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password, profileImage } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profileImage,
    });

    await newUser.save();
    const token = newUser.generateToken();
    const userDetail = {
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      profileImage: newUser.profileImage,
    };
    res.status(201).json({
      status: true,
      message: "User created successfully",
      token,
      data: userDetail,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user!" });
    }

    console.log("first", password)
    const isMatch = await user.comparePassword(password);
    console.log("first1", password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    const token = user.generateToken();
    const userDetail = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profileImage: user.profileImage,
    };

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      data: userDetail,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { firstname, lastname, profileImage } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    const updatedUser = {
      firstname: user.firstname,
      lastname: user.lastname,
      profileImage: user.profileImage,
    };

    res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const userProfile = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      profileImage: user.profileImage,
    };

    res.status(200).json({
      status: true,
      message: "Profile fetched successfully",
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      const otp = generate(4, {
        digits: true,
        alphabets: false,
        specialChars: false,
      });

      return res.status(200).json({
        status: true,
        message: "OTP has been sent to your email",
        otp,
      });
    }

    return res.status(400).json({
      status: false,
      message: "Email already registered",
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while verifying the email",
    });
  }
};

module.exports.matchOtp = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Email not found",
      });
    }
    const isMatch = await otpGenerator.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }
    await userModel.updateOne({ email }, { $set: { otp: null } });
    await userModel.updateOne({ email }, { $set: { emailVerified: true } });
    return res.status(200).json({
      status: true,
      message: "OTP matched successfully",
    });
  } catch (error) {
    console.error("Error in matchOtp:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while matching the OTP",
    });
  }
};
