const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { login, changePassword } = require("../controllers/authController");

router.post("/login", login);                    // PUBLIC
router.put("/password", protect, changePassword); // ADMIN

module.exports = router;
