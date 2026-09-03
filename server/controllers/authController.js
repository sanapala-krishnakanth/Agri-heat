import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function sign(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({
      token: sign(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: sign(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
