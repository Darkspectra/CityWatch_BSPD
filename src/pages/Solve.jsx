import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from "../context/ToastContext";
import BottomNav from "../components/BottomNav";
import LocationMapView from "../components/LocationMapView";

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

  return (
    <div className="page-wrap" style={{ maxWidth: 880 }}>
      <div className="page-title">Verified Reports</div>
      <p className="subtitle">{reports.length} record{reports.length !== 1 ? "s" : ""} awaiting resolution</p>

      {reports.length === 0 ? (
        <div className="empty-state">No verified reports awaiting resolution.</div>
      ) : (
        reports.map((r) => (
          <div key={r.id} className="card" style={{ marginBottom: 14 }}>
            <div className="card-top">
              <span className="card-title">{r.category}</span>
              <span className="badge" style={{ background: riskColors[r.riskLevel] || "#757575" }}>
                {r.riskLevel || "unrated"}
              </span>
            </div>
            <div className="card-desc">{r.description}</div>
            <div className="card-loc">{r.location}</div>
            <div className="card-loc">Reported by: {submitterNames[r.submittedBy] || "—"} · {formatDate(r.timestamp)}</div>

            {r.imageBase64 && (
              <img src={r.imageBase64} alt="" className="card-photo" style={{ marginTop: 10 }} />
            )}

            {r.verifiedLat != null && r.verifiedLng != null && (
              <div style={{ marginTop: 10 }}>
                <div className="location-confirmed-tag">📍 {r.verifiedLocationName || "Verified location"}</div>
                <LocationMapView lat={r.verifiedLat} lng={r.verifiedLng} label={r.verifiedLocationName} />
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => markSolved(r.id)}
            >
              Solved
            </button>
          </div>
        ))
      )}
      <BottomNav role="academia" />
    </div>
  );
}