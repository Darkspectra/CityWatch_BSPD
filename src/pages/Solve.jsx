import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from "../context/ToastContext";
import BottomNav from "../components/BottomNav";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const riskColors = { high: "#ff6b7a", medium: "#CC8400", low: "#4ade80" };

export default function Solve() {
  const [reports, setReports] = useState([]);
  const [submitterNames, setSubmitterNames] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      where("verificationStatus", "==", "approved"),
      where("solved", "==", false),
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

  const markSolved = async (id) => {
    await updateDoc(doc(db, "reports", id), { solved: true, solvedAt: Timestamp.now() });
    showToast("Marked as solved");
  };

  const formatDate = (ts) => {
    if (!ts?.toDate) return "—";
    return ts.toDate().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  // --- Chart data ---
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

  return (
    <div className="page-wrap" style={{ maxWidth: 880 }}>
      <div className="page-title">Verified Reports Dataset</div>
      <p className="subtitle">{reports.length} record{reports.length !== 1 ? "s" : ""} awaiting resolution</p>

      {reports.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
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
      )}

      {reports.length === 0 ? (
        <div className="empty-state">No verified reports awaiting resolution.</div>
      ) : (
        <div className="dataset-table">
          <div className="dataset-header">
            <span>Category</span>
            <span>Description</span>
            <span>Location</span>
            <span>Reported by</span>
            <span>Risk</span>
            <span>Date</span>
            <span></span>
          </div>
          {reports.map((r) => (
            <div key={r.id} className="dataset-row">
              <span className="dataset-cell dataset-category">{r.category}</span>
              <span className="dataset-cell dataset-desc">{r.description}</span>
              <span className="dataset-cell dataset-dim">{r.location}</span>
              <span className="dataset-cell dataset-dim">{submitterNames[r.submittedBy] || "—"}</span>
              <span className="dataset-cell">
                <span className="badge" style={{ background: riskColors[r.riskLevel] || "#757575" }}>
                  {r.riskLevel || "unrated"}
                </span>
              </span>
              <span className="dataset-cell dataset-dim">{formatDate(r.timestamp)}</span>
              <span className="dataset-cell">
                <button className="btn btn-primary" style={{ margin: 0, padding: "8px 14px", fontSize: 13 }} onClick={() => markSolved(r.id)}>
                  Solved
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
      <BottomNav role="academia" />
    </div>
  );
}