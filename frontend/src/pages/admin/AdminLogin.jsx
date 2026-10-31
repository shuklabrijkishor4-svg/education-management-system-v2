import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest, setToken } from "../../api.js";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      setToken(await loginRequest(username.trim(), password));
      navigate("/admin/enquiries", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Admin Login</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="u">Username</label>
            <input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
          </div>
          <div className="field">
            <label htmlFor="p">Password</label>
            <input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="login-back"><Link to="/">Back to website</Link></p>
      </div>
    </div>
  );
}
