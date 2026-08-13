import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import BottomNav from "../components/BottomNav";
import { useToast } from "../context/ToastContext";

export default function Solve() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      where("verificationStatus", "==", "approved"),
      where("solved", "==", false),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const { showToast } = useToast();

  const markSolved = async (id) => {
    await updateDoc(doc(db, "reports", id), { solved: true, solvedAt: Timestamp.now() });
    showToast("Marked as solved");
};

  return (
    <div className="page-wrap">
      <div className="page-title">Verified Reports</div>
      <p className="subtitle">Mark resolved once confirmed on the ground</p>

      {reports.length === 0 ? (
        <div className="empty-state">No verified reports awaiting resolution.</div>
      ) : (
        reports.map((r) => (
          <div key={r.id} className="card">
            <div className="card-title">{r.category}</div>
            <div className="card-desc">{r.description}</div>
            <div className="card-loc">{r.location}</div>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => markSolved(r.id)}>Solved</button>
          </div>
        ))
      )}
      <BottomNav role="academia" />
    </div>
  );
}