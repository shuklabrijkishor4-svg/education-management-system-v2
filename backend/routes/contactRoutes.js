const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createContact,
  getContacts,
  updateContactRead,
  deleteContact,
} = require("../controllers/contactController");

router.post("/", createContact);                    // PUBLIC: visitor sends a message
router.get("/", protect, getContacts);              // ADMIN: list all messages
router.patch("/:id/read", protect, updateContactRead); // ADMIN: mark read / unread
router.delete("/:id", protect, deleteContact);      // ADMIN: delete

module.exports = router;
