import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import BottomNav from "../components/BottomNav";
import { useToast } from "../context/ToastContext";

export default function Verify() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "reports"), where("verificationStatus", "==", "pending"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const { showToast } = useToast();

const handleDecision = async (id, decision) => {
  await updateDoc(doc(db, "reports", id), {
    verificationStatus: decision,
    status: decision === "approved" ? "verified" : "rejected"
  });
  showToast(decision === "approved" ? "Report approved" : "Report rejected");
};

  return (
    <div className="page-wrap">
      <div className="page-title">Reports to Verify</div>
      <p className="subtitle">Confirm whether these reports are accurate</p>

      {reports.length === 0 ? (
        <div className="empty-state">Nothing waiting for review right now.</div>
      ) : (
        reports.map((r) => (
          <div key={r.id} className="card">
            <div className="card-title">{r.category}</div>
            <div className="card-desc">{r.description}</div>
            <div className="card-loc">{r.location}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
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