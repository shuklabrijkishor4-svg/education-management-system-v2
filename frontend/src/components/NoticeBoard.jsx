import { useEffect, useState } from "react";
import { api } from "../api.js";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// Shows the notices added in the Admin Panel:
// 1) a scrolling ticker (marquee) and 2) a card for every notice.
export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const load = () =>
      api("/api/notices")
        .then((d) => setNotices(Array.isArray(d) ? d : []))
        .catch(() => {});
    load();
    const timer = setInterval(load, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

  if (notices.length === 0) return null; // nothing to show: hide the whole box

  // Ticker speed: longer text scrolls for longer, so the speed stays readable
  const totalChars = notices.reduce((sum, n) => sum + n.title.length + (n.message || "").length, 0);
  const duration = Math.max(20, Math.round(totalChars * 0.35)) + "s";

  const items = (suffix) =>
    notices.map((n) => (
      <span className="ticker-item" key={n._id + suffix}>
        <span className="ticker-dot" />
        <strong>{n.title}</strong>
        {n.message ? " - " + n.message.replace(/\s+/g, " ") : ""}
      </span>
    ));

  return (
    <section className="notice-board" aria-label="Latest notices">
      <div className="ticker">
        <span className="ticker-label">
          <span className="ticker-live" /> NOTICE
        </span>
        <div className="ticker-window">
          {/* Content is repeated twice so the loop has no gap */}
          <div className="ticker-track" style={{ animationDuration: duration }}>
            {items("-a")}
            {items("-b")}
          </div>
        </div>
      </div>

      <div className="container notice-list">
        <h2>Latest Notices</h2>
        <div className="notice-grid">
          {notices.map((n) => (
            <article className="notice" key={n._id}>
              <span className="notice-date">{fmt(n.createdAt)}</span>
              <h3>{n.title}</h3>
              {n.message && <p>{n.message}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
