const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }, // bcrypt hash
  },
  { timestamps: true, collection: "admins" }
);

module.exports = mongoose.model("Admin", adminSchema);
