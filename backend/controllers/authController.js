const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// POST /api/auth/login  { username, password }
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }
    const admin = await Admin.findOne({ username: String(username).trim().toLowerCase() });
    if (!admin || !(await bcrypt.compare(String(password), admin.password))) {
      return res.status(401).json({ success: false, message: "Wrong username or password." });
    }
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ success: true, token, username: admin.username });
  } catch (error) {
    console.error("login error:", error.message);
    res.status(500).json({ success: false, message: "Login failed." });
  }
};

// PUT /api/auth/password  { oldPassword, newPassword }  (admin)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new password are required." });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
    }
    const admin = await Admin.findById(req.user.id);
    if (!admin || !(await bcrypt.compare(String(oldPassword), admin.password))) {
      return res.status(400).json({ success: false, message: "Old password is wrong." });
    }
    admin.password = await bcrypt.hash(String(newPassword), 10);
    await admin.save();
    res.json({ success: true, message: "Password changed." });
  } catch (error) {
    console.error("changePassword error:", error.message);
    res.status(500).json({ success: false, message: "Could not change the password." });
  }
};
