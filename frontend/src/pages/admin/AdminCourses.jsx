import { useEffect, useState } from "react";
import { api } from "../../api.js";

const empty = { name: "", fullName: "", description: "", duration: "", fees: "", active: true };

export default function AdminCourses() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    api("/api/courses/all")
      .then((d) => { setRows(Array.isArray(d) ? d : []); setError(""); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const reset = () => { setForm(empty); setEditId(null); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editId) await api("/api/courses/" + editId, { method: "PUT", body: form });
      else await api("/api/courses", { method: "POST", body: form });
      reset();
      await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const edit = (c) => {
    setEditId(c._id);
    setForm({
      name: c.name || "", fullName: c.fullName || "", description: c.description || "",
      duration: c.duration || "", fees: c.fees || "", active: c.active !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (c) => {
    try {
      await api("/api/courses/" + c._id, { method: "PUT", body: { ...c, active: c.active === false } });
      load();
    } catch (err) { setError(err.message); }
  };

  const remove = async (c) => {
    if (!window.confirm('Delete course "' + c.name + '"?')) return;
    try { await api("/api/courses/" + c._id, { method: "DELETE" }); load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <div>
      <h1>Courses</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form className="panel form" onSubmit={save}>
        <h2>{editId ? "Edit course" : "Add a course"}</h2>
        <div className="form-row">
          <div className="field"><label>Course name *</label><input name="name" value={form.name} onChange={change} required /></div>
          <div className="field"><label>Full name</label><input name="fullName" value={form.fullName} onChange={change} /></div>
        </div>
        <div className="form-row">
          <div className="field"><label>Duration</label><input name="duration" value={form.duration} onChange={change} placeholder="3 Months" /></div>
          <div className="field"><label>Fees (Rs.)</label><input name="fees" type="number" min="0" value={form.fees} onChange={change} /></div>
        </div>
        <div className="field"><label>Description</label><textarea name="description" rows="2" value={form.description} onChange={change} /></div>
        <label className="check"><input type="checkbox" name="active" checked={form.active} onChange={change} /> Show on website</label>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : editId ? "Update course" : "Add course"}</button>
          {editId && <button type="button" className="btn btn-outline" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <h2 className="list-title">All courses ({rows.length})</h2>
      {loading ? <p>Loading...</p> : rows.length === 0 ? <div className="empty">No courses yet.</div> : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Duration</th><th>Fees</th><th>Visible</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}<div className="muted">{c.fullName}</div></td>
                  <td>{c.duration}</td>
                  <td>{c.fees > 0 ? "Rs. " + c.fees : "-"}</td>
                  <td>{c.active === false ? "Hidden" : "Yes"}</td>
                  <td className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => edit(c)}>Edit</button>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleActive(c)}>{c.active === false ? "Show" : "Hide"}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(c)}>Delete</button>
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
