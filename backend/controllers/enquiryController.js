// Controller = the code that runs when an API URL is called
const Enquiry = require("../models/Enquiry");

const mobileRegex = /^[6-9]\d{9}$/; // 10-digit Indian mobile number
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/enquiries  -> save a new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const body = req.body || {};
    const errors = [];

    // Server-side validation (never trust only the frontend)
    if (!body.studentName || !String(body.studentName).trim()) errors.push("Student name is required.");
    if (!body.mobile || !String(body.mobile).trim()) errors.push("Mobile number is required.");
    else if (!mobileRegex.test(String(body.mobile).trim())) errors.push("Enter a valid 10-digit mobile number.");
    if (body.email && !emailRegex.test(String(body.email).trim())) errors.push("Enter a valid email address.");
    if (!body.course) errors.push("Please select a course.");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    // Save only the fields we expect
    const enquiry = await Enquiry.create({
      studentName: body.studentName,
      fatherName: body.fatherName,
      mobile: body.mobile,
      email: body.email,
      dob: body.dob,
      gender: body.gender,
      address: body.address,
      qualification: body.qualification,
      course: body.course,
      preferredBatch: body.preferredBatch,
      message: body.message,
    });

    res.status(201).json({
      success: true,
      message: "Student enquiry submitted successfully.",
      data: enquiry,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("createEnquiry error:", error.message);
    res.status(500).json({ success: false, message: "Could not save the enquiry. Please try again." });
  }
};

// GET /api/enquiries  -> list all enquiries (newest first)
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    console.error("getEnquiries error:", error.message);
    res.status(500).json({ success: false, message: "Could not read enquiries." });
  }
};

// PATCH /api/enquiries/:id/status  (admin) -> New / Contacted / Admitted
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const status = (req.body || {}).status;
    if (!["New", "Contacted", "Admitted"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be New, Contacted or Admitted." });
    }
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found." });
    res.json({ success: true, message: "Status updated.", data: enquiry });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid enquiry id." });
    }
    console.error("updateEnquiryStatus error:", error.message);
    res.status(500).json({ success: false, message: "Could not update the status." });
  }
};

// DELETE /api/enquiries/:id  (admin)
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: "Enquiry not found." });
    res.json({ success: true, message: "Enquiry deleted." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid enquiry id." });
    }
    console.error("deleteEnquiry error:", error.message);
    res.status(500).json({ success: false, message: "Could not delete the enquiry." });
  }
};
