// Creates the first admin and starter courses (only when the collections are empty)
const bcrypt = require("bcryptjs");
const Course = require("./models/Course");
const Admin = require("./models/Admin");

module.exports = async function seedData() {
  try {
    if ((await Course.countDocuments()) === 0) {
      await Course.insertMany([
        { name: "Basic Computer", fullName: "Basic Computer Course", duration: "3 Months" },
        { name: "Tally", fullName: "Tally with GST", duration: "3 Months" },
        { name: "MS Office", fullName: "Word, Excel, PowerPoint", duration: "2 Months" },
        { name: "DCA", fullName: "Diploma in Computer Applications", duration: "6 Months" },
        { name: "Typing", fullName: "Hindi and English Typing", duration: "2 Months" },
        { name: "Internet & Email", fullName: "Internet, Email and Digital Skills", duration: "1 Month" },
      ]);
      console.log("Starter courses added.");
    }

    // Old courses saved before this fix may have no "active" field: make them visible
    await Course.updateMany({ active: { $exists: false } }, { $set: { active: true } });

    if ((await Admin.countDocuments()) === 0) {
      const username = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
      const password = process.env.ADMIN_PASSWORD || "admin123";
      await Admin.create({ username, password: await bcrypt.hash(password, 10) });
      console.log("First admin created. Username: " + username);
    }
  } catch (error) {
    console.error("Seed error:", error.message);
  }
};
