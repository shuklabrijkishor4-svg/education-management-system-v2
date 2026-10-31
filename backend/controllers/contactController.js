const Contact = require("../models/Contact");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact  -> save a new contact message
exports.createContact = async (req, res) => {
  try {
    const body = req.body || {};
    const errors = [];

    if (!body.name || !String(body.name).trim()) errors.push("Name is required.");
    if (!body.email || !String(body.email).trim()) errors.push("Email is required.");
    else if (!emailRegex.test(String(body.email).trim())) errors.push("Enter a valid email address.");
    if (!body.message || !String(body.message).trim()) errors.push("Message is required.");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    const contact = await Contact.create({
      name: body.name,
      email: body.email,
      mobile: body.mobile,
      message: body.message,
    });

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully.",
      data: contact,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("createContact error:", error.message);
    res.status(500).json({ success: false, message: "Could not send your message. Please try again." });
  }
};

// GET /api/contact  -> list all contact messages (newest first)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error("getContacts error:", error.message);
    res.status(500).json({ success: false, message: "Could not read messages." });
  }
};

// PATCH /api/contact/:id/read  (admin) -> mark a message read / unread
exports.updateContactRead = async (req, res) => {
  try {
    const isRead = Boolean((req.body || {}).isRead);
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, data: contact });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid message id." });
    }
    console.error("updateContactRead error:", error.message);
    res.status(500).json({ success: false, message: "Could not update the message." });
  }
};

// DELETE /api/contact/:id  (admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid message id." });
    }
    console.error("deleteContact error:", error.message);
    res.status(500).json({ success: false, message: "Could not delete the message." });
  }
};
