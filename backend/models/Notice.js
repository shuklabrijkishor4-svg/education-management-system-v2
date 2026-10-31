const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    message: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },   // false = hidden on website
    expiresAt: { type: Date, default: null },   // optional: last day to show it
  },
  { timestamps: true, collection: "notices" }
);

module.exports = mongoose.model("Notice", noticeSchema);
