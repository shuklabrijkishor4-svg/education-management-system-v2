import { useState } from "react";
import { API_BASE, Online } from "../config.js";

const emptyForm = { name: "", email: "", mobile: "", message: "" };

// Checks the contact form: name, email and message are required
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!form.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }
  if (!form.message.trim()) errors.message = "Please write a message.";
  return errors;
}

function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    const foundErrors = validate(form);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) {
      setStatus({ type: "error", text: "Please correct the highlighted fields." });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_BASE + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (response.ok) {
        setStatus({ type: "success", text: "Your message has been sent successfully." });
        setForm(emptyForm);
      } else {
        setStatus({ type: "error", text: result.message || "Could not send your message." });
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: "Cannot reach the server. Check that the backend is running on port 5000.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1>Contact Us</h1>
        <p className="section-intro">Visit us, call us, or send a message.</p>

        <div className="contact-grid">
          <div>
            <div className="info-card">
              <h2>{Online.name}</h2>
              <p><strong>Address:</strong> {Online.address}</p>
              <p><strong>Mobile:</strong> {Online.mobile}</p>
              <p><strong>Email:</strong> {Online.email}</p>

              <h3>Working hours</h3>
              {Online.hours.map((h) => (
                <p key={h.day}>{h.day}: {h.time}</p>
              ))}

              <h3>Follow us</h3>
              <div className="social">
                <span className="social-item">Facebook</span>
                <span className="social-item">Instagram</span>
                <span className="social-item">YouTube</span>
                <span className="social-item">WhatsApp</span>
              </div>
            </div>

            <div className="map-placeholder">Google Map will appear here</div>
          </div>

          <div>
            <h2>Send us a message</h2>

            {status.text && (
              <div className={"alert alert-" + status.type} role="alert">
                {status.text}
              </div>
            )}

            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="c-name">Name *</label>
                <input id="c-name" name="name" value={form.name} onChange={handleChange} className={errors.name ? "invalid" : ""} />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="c-email">Email *</label>
                <input id="c-email" name="email" type="email" value={form.email} onChange={handleChange} className={errors.email ? "invalid" : ""} />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="c-mobile">Mobile</label>
                <input id="c-mobile" name="mobile" type="tel" maxLength={10} value={form.mobile} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="c-message">Message *</label>
                <textarea id="c-message" name="message" rows="4" value={form.message} onChange={handleChange} className={errors.message ? "invalid" : ""} />
                {errors.message && <span className="error">{errors.message}</span>}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;