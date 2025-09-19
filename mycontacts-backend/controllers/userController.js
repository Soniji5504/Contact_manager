const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// @desc Register a user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("🔵 Registration request received:", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log("❌ Missing fields:", { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: "All fields are mandatory!" });
    }

    console.log("🔍 Checking for existing user with email:", email);
    const existingUser = await User.findOne({ email });
    console.log("📋 Existing user found:", !!existingUser);
    
    if (existingUser) {
      console.log("⚠️ User already exists with email:", email);
      return res.status(409).json({ message: "Email already exists!" });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully");

    console.log("💾 Creating new user in MongoDB...");
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    console.log("🎉 User created successfully in DB:", { id: newUser._id, username: newUser.username, email: newUser.email });

    if (!newUser) {
      console.log("❌ User creation failed - newUser is null");
      return res.status(400).json({ message: "User creation failed" });
    }

    console.log("🔑 Generating JWT token...");
    const accessToken = jwt.sign(
      {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    console.log("✅ JWT token generated successfully");

    const response = {
      access_token: accessToken,
      user: {
        _id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };
    console.log("📤 Sending response:", response);
    res.status(201).json(response);
  } catch (error) {
    console.error("💥 Registration error:", error);
    res.status(500).json({ message: "Registration failed: " + error.message });
  }
});

// @desc Login a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    console.log("🔵 Login request received:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing fields:", { email: !!email, password: !!password });
      return res.status(400).json({ message: "All fields are mandatory!" });
    }

    console.log("🔍 Looking for user with email:", email);
    const user = await User.findOne({ email });
    console.log("📋 User found in DB:", !!user);

    if (!user) {
      console.log("❌ User not found - email doesn't exist");
      return res.status(401).json({ message: "Email not found. Please register first." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔐 Password validation:", isPasswordValid);

    if (isPasswordValid) {
      console.log("✅ Password match successful");
      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      console.log("🔑 JWT token generated for login");

      const response = {
        access_token: accessToken,
        user: {
          _id: user.id,
          username: user.username,
          email: user.email,
        }
      };
      console.log("📤 Login successful, sending response");
      return res.status(200).json(response);
    } else {
      console.log("❌ Login failed - invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({ message: "Login failed: " + error.message });
  }
});

// @desc Get current logged-in user
// @route POST /api/users/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};