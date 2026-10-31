import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../../api.js";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin">
      <div className="admin-bar">
        <div className="admin-bar-inner">
          <strong className="admin-title">Admin Panel</strong>
          <nav className="admin-nav">
            <NavLink to="/admin/enquiries">Enquiries</NavLink>
            <NavLink to="/admin/messages">Messages</NavLink>
            <NavLink to="/admin/courses">Courses</NavLink>
            <NavLink to="/admin/notices">Notices</NavLink>
            <NavLink to="/admin/password">Password</NavLink>
          </nav>
          <div className="admin-actions">
            <Link to="/" className="admin-link-light">View website</Link>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
