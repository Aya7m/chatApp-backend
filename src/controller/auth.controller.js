import { sendWelcomeEmail } from "../emails/EmailHandler.js";
import { generateToken } from "../lib/generateToken.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
 

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // check is email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const NewUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    generateToken(NewUser._id, res);

    try {
      await sendWelcomeEmail(
        NewUser.email,
        NewUser.fullName,
        process.env.CLIENT_URL,
      );
    } catch (error) {
      console.error("Email error:", error);
    }

    return res.status(201).json({
      message: "User created successfully",
      _id: NewUser._id,
      fullName: NewUser.fullName,
      email: NewUser.email,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// login
