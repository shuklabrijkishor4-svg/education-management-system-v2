import { useState } from "react";
import { api } from "../../api.js";

export default function AdminPassword() {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) return setMsg({ type: "error", text: "New passwords do not match." });
    try {
      await api("/api/auth/password", { method: "PUT", body: { oldPassword, newPassword } });
      setMsg({ type: "success", text: "Password changed." });
      setOld(""); setNew(""); setConfirm("");
    } catch (err) { setMsg({ type: "error", text: err.message }); }
  };

  return (
    <div className="narrow-admin">
      <h1>Change Password</h1>
      {msg.text && <div className={"alert alert-" + msg.type}>{msg.text}</div>}
      <form className="panel form" onSubmit={submit}>
        <div className="field"><label>Old password</label><input type="password" value={oldPassword} onChange={(e) => setOld(e.target.value)} required /></div>
        <div className="field"><label>New password (min 6 characters)</label><input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} required /></div>
        <div className="field"><label>Confirm new password</label><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
        <button className="btn btn-primary">Update password</button>
      </form>
    </div>
  );
}
