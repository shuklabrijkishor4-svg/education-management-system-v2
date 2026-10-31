import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import StudentEnquiry from "./pages/StudentEnquiry.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminEnquiries from "./pages/admin/AdminEnquiries.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import AdminCourses from "./pages/admin/AdminCourses.jsx";
import AdminPassword from "./pages/admin/AdminPassword.jsx";
import AdminNotices from "./pages/admin/AdminNotices.jsx";

// App = the layout of the whole site.
// Public pages get the Navbar and Footer. Admin pages have their own top bar.
function App() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <div className="app">
      {!isAdminPage && <Navbar />}
      <main className="main">
        <Routes>
          {/* Public website */}
          <Route path="/" element={<Home />} />
          <Route path="/enquiry" element={<StudentEnquiry />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin panel */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="enquiries" replace />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="password" element={<AdminPassword />} />
          </Route>

          {/* Any unknown address goes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
