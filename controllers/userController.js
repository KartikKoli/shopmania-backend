import User from "../models/User.js";
import sendTokeninCookie from "../utilities/cookie.js";
import generateToken from "../utilities/token.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, address, role } =
      req.body;
    const roles = ["user", "admin"];
    if (!username || !email || !password || !confirmPassword || !address) {
      console.log("Insufficient user details");
      return res.status(400).json({
        success: false,
        message: "Please provide all details",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists!",
      });
    }
    if (password.length < 8 || password.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 6 and 20 characters",
      });
    }
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }
    const { houseNo, street, city } = address;
    if (!houseNo || !street || !city) {
      console.log("Incomplete address details!");
      return res.status(400).json({
        success: false,
        message: "Incomplete address details!",
      });
    }
    if (role && !roles.includes(role)) {
      console.log("Not a valid role");
      return res.status(400).json({
        success: false,
        message: "Not a valid role",
      });
    }
    const user = {
      username,
      email,
      password,
      confirmPassword,
      address: { houseNo, street, city },
      role,
    };
    await User.create(user);
    user.password = undefined;
    user.confirmPassword = undefined;
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error while registering user.",
    });
    console.log(`Error in registering user:${error.message}`);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password to login.",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials!",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }
    user.password = undefined;
    const token = generateToken(user);
    sendTokeninCookie(res, token);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.log(`Error while login: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie(process.env.ACCESS_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Error while logout:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while logging out.",
    });
  }
};
