import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import PixelFooter from "../components/PixelFooter";

const statusMeta = {
  pending: { label: "Awaiting review", color: "#CC8400" },
  approved: { label: "Verified", color: "#4B3F8F" },
  rejected: { label: "Rejected", color: "#B33B24" },
};

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "reports"), where("submittedBy", "==", user.uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [user]);

  return (
    <div className="page-wrap">
      <div className="page-title">Hi, {profile?.name || "there"}</div>
      <p className="subtitle">Your reports and their status</p>

      {reports.length === 0 ? (
        <div className="empty-state">No reports yet — tap Submit to report something.</div>
      ) : (
        reports.map((r) => {
          const meta = r.noticePublished
            ? { label: "Resolved — notice published", color: "#4ade80" }
            : r.solved
            ? { label: "Marked solved, awaiting government notice", color: "#22d3c9" }
            : statusMeta[r.verificationStatus] || statusMeta.pending;
          return (
            <div key={r.id} className="card">
              <div className="card-top">
                <span className="card-title">{r.category}</span>
                <span className="badge" style={{ background: meta.color }}>{meta.label}</span>
              </div>
              <div className="card-desc">{r.description}</div>
              <div className="card-loc">{r.location}</div>
            </div>
          );
        })
      )}
      <BottomNav role="citizen" />
      <PixelFooter />
    </div>
  );
}