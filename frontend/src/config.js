// ------------------------------------------------------------
// Change the values below to match YOUR institute.
// They are used on the Navbar, Footer and Contact pages.
// (Courses are no longer here: add or edit them in the Admin Panel.)
// ------------------------------------------------------------

// Backend API address (the Express server)
// On Render set VITE_API_BASE to your backend URL (e.g. https://my-backend.onrender.com)
export const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, "");
export const Online = {
  name: "Computer Gyan Online",
  tagline: "Computer education for every learner",
  address: "Kanpur Nagar,UttarPradesh - 000000",
  mobile: "+91 6393706103",
  email: "shuklabrijkishor4@gmail.com",
  hours: [
    { day: "Monday - Saturday", time: "9:00 AM - 7:00 PM" },
    { day: "Sunday", time: "Closed" },
  ],
};
