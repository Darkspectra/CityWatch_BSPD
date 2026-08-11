import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

const statusColors = { submitted: "#B33B24", triaged: "#4B3F8F", logged: "#CC8400", recovering: "#00796B", resolved: "#4CAF50" };
const riskColors = { high: "#22d3c9", low: "#CC8400", pending: "#757575" };
const statusFilters = ["all", "submitted", "triaged", "logged", "recovering", "resolved"];

export default function Dashboard() {
  const { user, role } = useAuth();
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const isElevated = role === "government" || role === "academia";

  useEffect(() => {
    if (!user) return;
    const q = isElevated
      ? query(collection(db, "reports"), orderBy("timestamp", "desc"))
      : query(collection(db, "reports"), where("submittedBy", "==", user.uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [user, isElevated]);

  const filtered = reports.filter((r) => {
    const matchFilter = filter === "all" || r.status === filter;
    const term = search.toLowerCase();
    const matchSearch = !term || [r.description, r.location, r.category].some((f) => (f || "").toLowerCase().includes(term));
    return matchFilter && matchSearch;
  });

  return (
    <div className="page-wrap">
      <div className="page-title">Dashboard</div>
      <p className="subtitle">{isElevated ? "All reports across the city" : "Your reports"}</p>
      <input className="field" placeholder="Search description, location, category" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="chip-row">
        {statusFilters.map((s) => (
          <div key={s} className={"chip" + (filter === s ? " active" : "")} onClick={() => setFilter(s)}>
            {s[0].toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">{reports.length === 0 ? "No reports yet" : "No reports match your filters"}</div>
      ) : (
        filtered.map((r) => (
          <div key={r.id} className="card">
            <div className="card-top">
              <span className="card-title">{r.category || "uncategorized"}</span>
              <span className="badge" style={{ background: statusColors[r.status] || "#757575" }}>{r.status}</span>
            </div>
            <div className="card-desc">{r.description}</div>
            <div className="card-loc">{r.location}</div>
            {r.riskLevel && r.riskLevel !== "pending" && (
              <span className="risk-badge" style={{ background: (riskColors[r.riskLevel] || "#757575") + "26", color: riskColors[r.riskLevel] }}>
                {r.riskLevel} risk
              </span>
            )}
          </div>
        ))
      )}
      <BottomNav />
    </div>
  );
}