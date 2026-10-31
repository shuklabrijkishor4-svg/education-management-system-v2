const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const c = require("../controllers/courseController");

router.get("/", c.getActiveCourses);          // PUBLIC
router.get("/all", protect, c.getAllCourses); // ADMIN  (must stay above "/:id")
router.post("/", protect, c.createCourse);    // ADMIN
router.put("/:id", protect, c.updateCourse);  // ADMIN
router.delete("/:id", protect, c.deleteCourse); // ADMIN

module.exports = router;
