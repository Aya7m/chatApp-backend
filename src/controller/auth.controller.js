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

    // create user
    const NewUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (NewUser) {
      generateToken(NewUser._id, res);
      await NewUser.save();
      return res
        .status(201)
        .json({
          message: "User created successfully",
          _id: NewUser._id,
          fullName: NewUser.fullName,
          email: NewUser.email,
          profilePicture: NewUser.profilePicture,
        });
        //Todo: send welcome email to user
    } else {
      return res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" ,error: error.message});
  }
};


// login
export const signIn=async(req,res)=>{
    try {
        
        const{email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }
        generateToken(user._id,res)
        return res.status(200).json({
            message:"User logged in successfully",
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePicture:user.profilePicture,
        })
        
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}