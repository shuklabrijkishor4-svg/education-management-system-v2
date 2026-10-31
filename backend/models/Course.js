const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Course name is required"], trim: true },
    fullName: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    duration: { type: String, trim: true, default: "" },
    fees: { type: Number, default: 0 },
    active: { type: Boolean, default: true }, // false = hidden on website
  },
  { timestamps: true, collection: "courses" }
);

module.exports = mongoose.model("Course", courseSchema);
