import { useEffect, useState } from "react";
import { api } from "../../api.js";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-");
const empty = { title: "", message: "", expiresAt: "" };

export default function AdminNotices() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api("/api/notices/all")
      .then((d) => { setRows(Array.isArray(d) ? d : []); setError(""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setOk("");
    try {
      await api("/api/notices", { method: "POST", body: form });
      setForm(empty);
      setOk("Notice published. It is now visible on the website Home page.");
      await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const toggle = async (n) => {
    try { await api("/api/notices/" + n._id, { method: "PUT", body: { active: !n.active } }); load(); }
    catch (err) { setError(err.message); }
  };

  const remove = async (n) => {
    if (!window.confirm('Delete notice "' + n.title + '"?')) return;
    try { await api("/api/notices/" + n._id, { method: "DELETE" }); load(); }
    catch (err) { setError(err.message); }
  };

  const expired = (n) => n.expiresAt && new Date(n.expiresAt) < new Date();

  return (
    <div>
      <h1>Notices</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {ok && <div className="alert alert-success">{ok}</div>}

      <form className="panel form" onSubmit={save}>
        <h2>Add a notice</h2>
        <div className="field">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={change} placeholder="New batch starts on Monday" required />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea name="message" rows="3" value={form.message} onChange={change} />
        </div>
        <div className="field">
          <label>Show until (optional)</label>
          <input name="expiresAt" type="date" value={form.expiresAt} onChange={change} />
          <span className="muted">Leave empty to show it until you hide or delete it.</span>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Publishing..." : "Publish notice"}</button>
        </div>
      </form>

      <h2 className="list-title">All notices ({rows.length})</h2>
      {loading ? <p>Loading...</p> : rows.length === 0 ? <div className="empty">No notices yet.</div> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Date</th><th>Notice</th><th>Show until</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((n) => (
                <tr key={n._id}>
                  <td>{fmt(n.createdAt)}</td>
                  <td><strong>{n.title}</strong><div className="message-cell muted">{n.message}</div></td>
                  <td>{fmt(n.expiresAt)}</td>
                  <td>{!n.active ? "Hidden" : expired(n) ? "Expired" : "Visible"}</td>
                  <td className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => toggle(n)}>{n.active ? "Hide" : "Show"}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(n)}>Delete</button>
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
