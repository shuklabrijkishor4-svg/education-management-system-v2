const Course = require("../models/Course");

const pick = (b) => ({
  name: b.name,
  fullName: b.fullName,
  description: b.description,
  duration: b.duration,
  fees: Number(b.fees) || 0,
  active: b.active === undefined ? true : Boolean(b.active),
});

const handle = (res, error, label) => {
  if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message });
  if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid course id." });
  console.error(label + " error:", error.message);
  res.status(500).json({ success: false, message: "Course request failed." });
};

// GET /api/courses  (public: only active courses)
exports.getActiveCourses = async (req, res) => {
  try {
    const data = await Course.find({ active: { $ne: false } }).sort({ createdAt: 1 });
    res.json({ success: true, count: data.length, data });
  } catch (e) { handle(res, e, "getActiveCourses"); }
};

// GET /api/courses/all  (admin: including hidden)
exports.getAllCourses = async (req, res) => {
  try {
    const data = await Course.find().sort({ createdAt: 1 });
    res.json({ success: true, count: data.length, data });
  } catch (e) { handle(res, e, "getAllCourses"); }
};

exports.createCourse = async (req, res) => {
  try {
    const data = await Course.create(pick(req.body || {}));
    res.status(201).json({ success: true, data });
  } catch (e) { handle(res, e, "createCourse"); }
};

exports.updateCourse = async (req, res) => {
  try {
    const data = await Course.findByIdAndUpdate(req.params.id, pick(req.body || {}), {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, data });
  } catch (e) { handle(res, e, "updateCourse"); }
};

exports.deleteCourse = async (req, res) => {
  try {
    const data = await Course.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course deleted." });
  } catch (e) { handle(res, e, "deleteCourse"); }
};
