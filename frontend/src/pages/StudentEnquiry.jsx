import { useState } from "react";
import { api } from "../api.js";
import useCourses from "../useCourses.js";

const emptyForm = {
  studentName: "", fatherName: "", mobile: "", email: "", dob: "", gender: "",
  address: "", qualification: "", course: "", preferredBatch: "", message: "",
};

function validate(f) {
  const e = {};
  if (!f.studentName.trim()) e.studentName = "Please enter the student name.";
  if (!f.mobile.trim()) e.mobile = "Please enter a mobile number.";
  else if (!/^[6-9]\d{9}$/.test(f.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number.";
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!f.course) e.course = "Please select a course.";
  return e;
}

export default function StudentEnquiry() {
  const { courses } = useCourses();
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
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ type: "error", text: "Please correct the highlighted fields." });
      return;
    }
    setSubmitting(true);
    try {
      await api("/api/enquiries", { method: "POST", body: form });
      setStatus({ type: "success", text: "Thank you! Your enquiry has been submitted. We will call you soon." });
      setForm(emptyForm);
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, extra = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} value={form[name]} onChange={handleChange}
        className={errors[name] ? "invalid" : ""} {...extra} />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </div>
  );

  return (
    <section className="section">
      <div className="container narrow">
        <h1>Student Enquiry</h1>
        <p className="section-intro">Fill in the form and we will contact you.</p>

        {status.text && <div className={"alert alert-" + status.type} role="alert">{status.text}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            {field("studentName", "Student name *")}
            {field("fatherName", "Father's name")}
          </div>
          <div className="form-row">
            {field("mobile", "Mobile *", { type: "tel", maxLength: 10 })}
            {field("email", "Email", { type: "email" })}
          </div>
          <div className="form-row">
            {field("dob", "Date of birth", { type: "date" })}
            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          {field("address", "Address")}
          <div className="form-row">
            <div className="field">
              <label htmlFor="qualification">Qualification</label>
              <select id="qualification" name="qualification" value={form.qualification} onChange={handleChange}>
                <option value="">Select</option>
                <option>8th - 10th</option>
                <option>12th</option>
                <option>Graduate</option>
                <option>Post Graduate</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="course">Course *</label>
              <select id="course" name="course" value={form.course} onChange={handleChange}
                className={errors.course ? "invalid" : ""}>
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.course && <span className="error">{errors.course}</span>}
            </div>
          </div>
          <div className="field">
            <label htmlFor="preferredBatch">Preferred batch</label>
            <select id="preferredBatch" name="preferredBatch" value={form.preferredBatch} onChange={handleChange}>
              <option value="">Select</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="3" value={form.message} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit enquiry"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
