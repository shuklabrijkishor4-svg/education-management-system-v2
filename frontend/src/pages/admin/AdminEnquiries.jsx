import { Fragment, useEffect, useMemo, useState } from "react";
import { api } from "../../api.js";
import { downloadCsv } from "../../csv.js";

const STATUSES = ["New", "Contacted", "Admitted"];
const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

export default function AdminEnquiries() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = () => {
    setLoading(true);
    api("/api/enquiries")
      .then((d) => { setRows(Array.isArray(d) ? d : []); setError(""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const courses = useMemo(() => [...new Set(rows.map((r) => r.course).filter(Boolean))], [rows]);

  const shown = rows.filter((r) => {
    const st = r.status || "New"; // old records have no status
    const q = search.trim().toLowerCase();
    if (q && !`${r.studentName} ${r.fatherName} ${r.mobile} ${r.email}`.toLowerCase().includes(q)) return false;
    if (course && r.course !== course) return false;
    if (status && st !== status) return false;
    const day = r.createdAt ? r.createdAt.slice(0, 10) : "";
    if (from && day < from) return false;
    if (to && day > to) return false;
    return true;
  });

  const changeStatus = async (id, value) => {
    try {
      await api("/api/enquiries/" + id + "/status", { method: "PATCH", body: { status: value } });
      setRows(rows.map((r) => (r._id === id ? { ...r, status: value } : r)));
    } catch (e) { alert(e.message); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await api("/api/enquiries/" + id, { method: "DELETE" });
      setRows(rows.filter((r) => r._id !== id));
    } catch (e) { alert(e.message); }
  };

  const exportCsv = () =>
    downloadCsv("enquiries.csv", [
      { label: "Date", value: (r) => fmt(r.createdAt) },
      { label: "Student", value: (r) => r.studentName },
      { label: "Father", value: (r) => r.fatherName },
      { label: "Mobile", value: (r) => r.mobile },
      { label: "Email", value: (r) => r.email },
      { label: "DOB", value: (r) => r.dob },
      { label: "Gender", value: (r) => r.gender },
      { label: "Address", value: (r) => r.address },
      { label: "Qualification", value: (r) => r.qualification },
      { label: "Course", value: (r) => r.course },
      { label: "Batch", value: (r) => r.preferredBatch },
      { label: "Status", value: (r) => r.status || "New" },
      { label: "Message", value: (r) => r.message },
    ], shown);

  const count = (s) => rows.filter((r) => (r.status || "New") === s).length;

  return (
    <div>
      <h1>Student Enquiries</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats">
        <div className="stat"><strong>{rows.length}</strong>Total</div>
        {STATUSES.map((s) => <div className="stat" key={s}><strong>{count(s)}</strong>{s}</div>)}
      </div>

      <div className="toolbar">
        <input placeholder="Search name, mobile, email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">All courses</option>
          {courses.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label className="date-filter">From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="date-filter">To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button className="btn btn-outline btn-sm" onClick={load}>Refresh</button>
        <button className="btn btn-primary btn-sm" onClick={exportCsv} disabled={!shown.length}>Export Excel (CSV)</button>
      </div>

      <p className="result-count">Showing {shown.length} of {rows.length}</p>

      {loading ? <p>Loading...</p> : shown.length === 0 ? (
        <div className="empty">{rows.length === 0 ? "No enquiries yet. Submit one from the Student Enquiry page to test." : "No enquiry matches the filters."}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Student</th><th>Mobile</th><th>Course</th><th>Batch</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const st = r.status || "New";
                return (
                  <Fragment key={r._id}>
                    <tr>
                      <td>{fmt(r.createdAt)}</td>
                      <td>{r.studentName}<div className="muted">{r.email}</div></td>
                      <td>{r.mobile}</td>
                      <td>{r.course}</td>
                      <td>{r.preferredBatch}</td>
                      <td>
                        <select className={"status-select status-" + st} value={st} onChange={(e) => changeStatus(r._id, e.target.value)}>
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="row-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => setOpenId(openId === r._id ? null : r._id)}>
                          {openId === r._id ? "Hide" : "Details"}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(r._id)}>Delete</button>
                      </td>
                    </tr>
                    {openId === r._id && (
                      <tr className="details-row">
                        <td colSpan="7">
                          <div className="details">
                            <p><strong>Father:</strong> {r.fatherName || "-"}</p>
                            <p><strong>DOB:</strong> {r.dob || "-"}</p>
                            <p><strong>Gender:</strong> {r.gender || "-"}</p>
                            <p><strong>Qualification:</strong> {r.qualification || "-"}</p>
                            <p><strong>Address:</strong> {r.address || "-"}</p>
                            <p><strong>Message:</strong> {r.message || "-"}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
