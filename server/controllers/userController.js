import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// login user
const loginUser = async (req, res) => {
  const { login, password } = req.body; // 'login' can be either email or username
  try {
    const user = await userModel.findOne({
      $or: [
        { email: login },
        { username: login }
      ]
    });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  }

  catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }

};

// register user
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // checking if user already exists (email or username)
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.json({ success: false, message: "Email already in use" });
    }

    const existUsername = await userModel.findOne({ username });
    if (existUsername) {
      return res.json({ success: false, message: "Username already in use" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a stronger password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const userData = async (req, res) => {
  try {
    const userdata = await userModel.findById(req.body.userId);
    if (userdata) {
      res.json({ success: true, username: userdata.username });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};



export { loginUser, registerUser, userData };
