const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/noticeController");

router.get("/", c.getPublicNotices);            // PUBLIC: shown on the website
router.get("/all", protect, c.getAllNotices);   // ADMIN (must stay above "/:id")
router.post("/", protect, c.createNotice);      // ADMIN
router.put("/:id", protect, c.updateNotice);    // ADMIN
router.delete("/:id", protect, c.deleteNotice); // ADMIN

module.exports = router;
