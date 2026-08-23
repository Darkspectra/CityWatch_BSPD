import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from "../context/ToastContext";
import BottomNav from "../components/BottomNav";

export default function Verify() {
  const [reports, setReports] = useState([]);
  const [riskChoice, setRiskChoice] = useState({});
  const [removing, setRemoving] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "reports"), where("verificationStatus", "==", "pending"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const handleDecision = async (id, decision) => {
    setRemoving((prev) => ({ ...prev, [id]: true }));
    const riskLevel = riskChoice[id] || "medium";

    setTimeout(async () => {
      await updateDoc(doc(db, "reports", id), {
        verificationStatus: decision,
        status: decision === "approved" ? "verified" : "rejected",
        riskLevel: decision === "approved" ? riskLevel : null,
      });
      showToast(decision === "approved" ? "Report approved" : "Report rejected");
    }, 280);
  };

  return (
    <div className="page-wrap">
      <div className="page-title">Reports to Verify</div>
      <p className="subtitle">Confirm accuracy and assign a risk level</p>

      {reports.length === 0 ? (
        <div className="empty-state">Nothing waiting for review right now.</div>
      ) : (
        reports.map((r) => (
          <div key={r.id} className={"card" + (removing[r.id] ? " card-exit" : "")}>
            <div className="card-title">{r.category}</div>
            <div className="card-desc">{r.description}</div>
            <div className="card-loc">{r.location}</div>

            <div className="chip-row" style={{ marginTop: 12, marginBottom: 4 }}>
              {["low", "medium", "high"].map((level) => (
                <div
                  key={level}
                  className={"chip" + ((riskChoice[r.id] || "medium") === level ? " active" : "")}
                  onClick={() => setRiskChoice((prev) => ({ ...prev, [r.id]: level }))}
                >
                  {level[0].toUpperCase() + level.slice(1)} risk
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button className="btn btn-primary" style={{ margin: 0 }} onClick={() => handleDecision(r.id, "approved")}>Approve</button>
              <button className="btn btn-secondary" style={{ margin: 0 }} onClick={() => handleDecision(r.id, "rejected")}>Reject</button>
            </div>
          </div>
        ))
      )}
      <BottomNav role="industrial" />
    </div>
  );
}