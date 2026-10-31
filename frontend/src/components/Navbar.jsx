import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Online } from "../config.js";

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          {Online.name}
        </Link>

        <button
          className="menu-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/enquiry" onClick={close}>Student Enquiry</NavLink>
          <NavLink to="/contact" onClick={close}>Contact Us</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;