const Notice = require("../models/Notice");

// "2026-10-20" -> end of that day
const endOfDay = (value) => (value ? new Date(value + "T23:59:59.999") : null);

const handle = (res, error, label) => {
  if (error.name === "ValidationError") return res.status(400).json({ success: false, message: error.message });
  if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid notice id." });
  console.error(label + " error:", error.message);
  res.status(500).json({ success: false, message: "Notice request failed." });
};

// GET /api/notices  (public: only active and not expired)
exports.getPublicNotices = async (req, res) => {
  try {
    const data = await Notice.find({
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (e) { handle(res, e, "getPublicNotices"); }
};

// GET /api/notices/all  (admin)
exports.getAllNotices = async (req, res) => {
  try {
    const data = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (e) { handle(res, e, "getAllNotices"); }
};

exports.createNotice = async (req, res) => {
  try {
    const b = req.body || {};
    const data = await Notice.create({
      title: b.title,
      message: b.message,
      active: b.active === undefined ? true : Boolean(b.active),
      expiresAt: endOfDay(b.expiresAt),
    });
    res.status(201).json({ success: true, data });
  } catch (e) { handle(res, e, "createNotice"); }
};

exports.updateNotice = async (req, res) => {
  try {
    const b = req.body || {};
    const update = {};
    if (b.title !== undefined) update.title = b.title;
    if (b.message !== undefined) update.message = b.message;
    if (b.active !== undefined) update.active = Boolean(b.active);
    if (b.expiresAt !== undefined) update.expiresAt = endOfDay(b.expiresAt);
    const data = await Notice.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: "Notice not found." });
    res.json({ success: true, data });
  } catch (e) { handle(res, e, "updateNotice"); }
};

exports.deleteNotice = async (req, res) => {
  try {
    const data = await Notice.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Notice not found." });
    res.json({ success: true, message: "Notice deleted." });
  } catch (e) { handle(res, e, "deleteNotice"); }
};
