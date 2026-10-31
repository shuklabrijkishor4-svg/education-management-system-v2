import { useEffect, useState } from "react";
import { api } from "../../api.js";
import { downloadCsv } from "../../csv.js";

const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "");

export default function AdminMessages() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const load = () => {
    setLoading(true);
    api("/api/contact")
      .then((d) => { setRows(Array.isArray(d) ? d : []); setError(""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const shown = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    if (q && !`${r.name} ${r.email} ${r.mobile} ${r.message}`.toLowerCase().includes(q)) return false;
    if (filter === "unread" && r.isRead) return false;
    if (filter === "read" && !r.isRead) return false;
    return true;
  });

  const toggleRead = async (r) => {
    try {
      await api("/api/contact/" + r._id + "/read", { method: "PATCH", body: { isRead: !r.isRead } });
      setRows(rows.map((x) => (x._id === r._id ? { ...x, isRead: !r.isRead } : x)));
    } catch (e) { alert(e.message); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api("/api/contact/" + id, { method: "DELETE" });
      setRows(rows.filter((r) => r._id !== id));
    } catch (e) { alert(e.message); }
  };

  const exportCsv = () =>
    downloadCsv("messages.csv", [
      { label: "Date", value: (r) => fmt(r.createdAt) },
      { label: "Name", value: (r) => r.name },
      { label: "Email", value: (r) => r.email },
      { label: "Mobile", value: (r) => r.mobile },
      { label: "Message", value: (r) => r.message },
      { label: "Read", value: (r) => (r.isRead ? "Yes" : "No") },
    ], shown);

  return (
    <div>
      <h1>Contact Messages</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <input placeholder="Search name, email, message..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={load}>Refresh</button>
        <button className="btn btn-primary btn-sm" onClick={exportCsv} disabled={!shown.length}>Export Excel (CSV)</button>
      </div>

      <p className="result-count">Showing {shown.length} of {rows.length}</p>

      {loading ? <p>Loading...</p> : shown.length === 0 ? (
        <div className="empty">{rows.length === 0 ? "No messages yet." : "No message matches the filters."}</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Message</th><th>Actions</th></tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r._id} className={r.isRead ? "" : "unread"}>
                  <td>{fmt(r.createdAt)}</td>
                  <td>{r.name}</td>
                  <td>{r.email}<div className="muted">{r.mobile}</div></td>
                  <td className="message-cell">{r.message}</td>
                  <td className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => toggleRead(r)}>
                      {r.isRead ? "Mark unread" : "Mark read"}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(r._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
