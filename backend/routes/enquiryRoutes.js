const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiryController");

router.post("/", createEnquiry);                             // PUBLIC: student submits the form
router.get("/", protect, getEnquiries);                      // ADMIN: list all enquiries
router.patch("/:id/status", protect, updateEnquiryStatus);   // ADMIN: change status
router.delete("/:id", protect, deleteEnquiry);               // ADMIN: delete

module.exports = router;
