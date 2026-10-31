// Schema = the shape of one student enquiry saved in MongoDB
const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    studentName: { type: String, required: [true, "Student name is required"], trim: true },
    fatherName: { type: String, trim: true, default: "" },
    mobile: { type: String, required: [true, "Mobile number is required"], trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    dob: { type: String, default: "" }, // stored as text like 2005-08-21
    gender: { type: String, default: "" },
    address: { type: String, trim: true, default: "" },
    qualification: { type: String, default: "" },
    course: { type: String, required: [true, "Course is required"] },
    preferredBatch: { type: String, default: "" },
    message: { type: String, trim: true, default: "" },
    // Admin can change this: New -> Contacted -> Admitted
    status: { type: String, enum: ["New", "Contacted", "Admitted"], default: "New" },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    collection: "student_enquiries", // exact collection name in MongoDB
  }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
