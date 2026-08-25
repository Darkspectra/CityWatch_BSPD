import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import HomeButton from "../components/HomeButton";
import BottomNav from "../components/BottomNav";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const riskColors = { high: "#ff6b7a", medium: "#CC8400", low: "#4ade80" };

export default function Statistics() {
  const [reports, setReports] = useState([]);
  const [submitterNames, setSubmitterNames] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      where("verificationStatus", "==", "approved"),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, async (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReports(list);
      const missing = list.filter((r) => r.submittedBy && !submitterNames[r.submittedBy]);
      for (const r of missing) {
        const userSnap = await getDoc(doc(db, "users", r.submittedBy));
        if (userSnap.exists()) {
          setSubmitterNames((prev) => ({ ...prev, [r.submittedBy]: userSnap.data().name }));
        }
      }
    });
    return unsub;
  }, []);

  const formatDate = (ts) => {
    if (!ts?.toDate) return "—";
    return ts.toDate().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  const riskCounts = ["low", "medium", "high"].map((level) => ({
    name: level[0].toUpperCase() + level.slice(1),
    value: reports.filter((r) => r.riskLevel === level).length,
    key: level,
  })).filter((d) => d.value > 0);

  const timelineMap = {};
  reports.forEach((r) => {
    const d = r.timestamp?.toDate ? r.timestamp.toDate().toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";
    timelineMap[d] = (timelineMap[d] || 0) + 1;
  });
  const timelineData = Object.entries(timelineMap).map(([date, count]) => ({ date, count }));

  const filtered = reports.filter((r) => {
    const term = search.toLowerCase();
    const name = submitterNames[r.submittedBy] || "";
    return !term ||
      name.toLowerCase().includes(term) ||
      (r.category || "").toLowerCase().includes(term) ||
      (r.location || "").toLowerCase().includes(term) ||
      (r.description || "").toLowerCase().includes(term);
  });

  return (
    <div className="page-wrap" style={{ maxWidth: 900 }}>
      <HomeButton />
      <div className="page-title">Statistics</div>
      <p className="subtitle">Overview of all verified reports</p>

      {reports.length === 0 ? (
        <div className="empty-state">No verified reports yet.</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            <div className="card" style={{ height: 220 }}>
              <div className="card-title" style={{ marginBottom: 8, fontSize: 13 }}>Reports by Risk Level</div>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={riskCounts} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} paddingAngle={3}>
                    {riskCounts.map((entry) => (
                      <Cell key={entry.key} fill={riskColors[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0d2b21", border: "1px solid rgba(74,222,168,0.3)", borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ height: 220 }}>
              <div className="card-title" style={{ marginBottom: 8, fontSize: 13 }}>Reports Over Time</div>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={timelineData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8fa89c" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#8fa89c" }} />
                  <Tooltip contentStyle={{ background: "#0d2b21", border: "1px solid rgba(74,222,168,0.3)", borderRadius: 10, fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#22d3a8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <input
            className="field"
            placeholder="Search by name, category, location, description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="dataset-table">
            <div className="dataset-header">
              <span>Citizen</span>
              <span>Problem</span>
              <span>Location</span>
              <span>Category</span>
              <span>Risk</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {filtered.map((r) => {
              const statusLabel = r.noticePublished ? "Resolved" : r.solved ? "Solved" : "Verified";
              return (
                <div key={r.id} className="dataset-row">
                  <span className="dataset-cell dataset-dim">{submitterNames[r.submittedBy] || "—"}</span>
                  <span className="dataset-cell dataset-desc">{r.description}</span>
                  <span className="dataset-cell dataset-dim">{r.location}</span>
                  <span className="dataset-cell dataset-category">{r.category}</span>
                  <span className="dataset-cell">
                    <span className="badge" style={{ background: riskColors[r.riskLevel] || "#757575" }}>
                      {r.riskLevel || "unrated"}
                    </span>
                  </span>
                  <span className="dataset-cell dataset-dim">{statusLabel}</span>
                  <span className="dataset-cell dataset-dim">{formatDate(r.timestamp)}</span>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">No reports match your search.</div>
          )}
        </>
      )}
      <BottomNav role="academia" />
    </div>
  );
}