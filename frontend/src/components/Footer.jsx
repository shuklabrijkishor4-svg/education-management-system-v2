import { Link } from "react-router-dom";
import { Online } from "../config.js";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>{Online.name}</h3>
          <p>{Online.tagline}</p>
        </div>

        <div>
          <h4>Pages</h4>
          <p><Link to="/">Home</Link></p>
          <p><Link to="/enquiry">Student Enquiry</Link></p>
          <p><Link to="/contact">Contact Us</Link></p>
          <p><Link to="/admin/login">Admin Login</Link></p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>{Online.address}</p>
          <p>{Online.mobile}</p>
          <p>{Online.email}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;