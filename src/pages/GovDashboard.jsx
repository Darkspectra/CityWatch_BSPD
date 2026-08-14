import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import BottomNav from "../components/BottomNav";
import { useToast } from "../context/ToastContext";
import { collection as fbCollection } from "firebase/firestore";


export default function GovDashboard() {
  const [solvedReports, setSolvedReports] = useState([]);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [posted, setPosted] = useState("");
  const [allReports, setAllReports] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      where("solved", "==", true),
      where("noticePublished", "==", false),
      orderBy("solvedAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => setSolvedReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

   useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => setAllReports(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const publishResolution = async (report) => {
  await addDoc(collection(db, "notifications"), { /* ...unchanged... */ });
  await updateDoc(doc(db, "reports", report.id), { noticePublished: true });
  showToast("Resolution announcement published");
  };

  const publishAlert = async (e) => {
    e.preventDefault();
    if (!alertTitle.trim() || !alertMessage.trim()) return;
    await addDoc(collection(db, "notifications"), {
      type: "alert",
      title: alertTitle,
      message: alertMessage,
      createdAt: Timestamp.now()
    });
    setAlertTitle(""); setAlertMessage("");
    showToast("Announcement published to all users");
    setTimeout(() => setPosted(""), 3000);
  };

  return (
    <div className="page-wrap">
      <div className="page-title">Government Dashboard</div>
      <p className="subtitle">Publish alerts and confirm resolutions</p>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>Publish an Alert</div>
        {posted && <p className="success-text">{posted}</p>}
        <form onSubmit={publishAlert}>
          <input className="field" placeholder="Title" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} />
          <textarea className="field" placeholder="Message to citizens" value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} />
          <button className="btn btn-primary" type="submit">Publish Alert</button>
        </form>
      </div>

      <div className="page-title" style={{ fontSize: 17, marginTop: 24, marginBottom: 8 }}>Ready to Confirm Resolved</div>
      {solvedReports.length === 0 ? (
        <div className="empty-state">Nothing awaiting a resolution notice.</div>
      ) : (
        solvedReports.map((r) => (
          <div key={r.id} className="card">
            <div className="card-title">{r.category}</div>
            <div className="card-desc">{r.description}</div>
            <div className="card-loc">{r.location}</div>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => publishResolution(r)}>Publish Resolution Announcement</button>
          </div>
        ))
      )}

      <div className="page-title" style={{ fontSize: 17, marginTop: 28, marginBottom: 8 }}>
  All Citizen Reports
</div>
{allReports.length === 0 ? (
  <div className="empty-state">No reports submitted yet.</div>
) : (
  allReports.map((r) => {
    const statusLabel = r.noticePublished ? "Resolved"
      : r.solved ? "Solved, awaiting notice"
      : r.verificationStatus === "approved" ? "Verified"
      : r.verificationStatus === "rejected" ? "Rejected"
      : "Pending review";
    const statusColor = r.noticePublished ? "#4ade80"
      : r.solved ? "#22d3c9"
      : r.verificationStatus === "approved" ? "#4B3F8F"
      : r.verificationStatus === "rejected" ? "#B33B24"
      : "#CC8400";
    return (
      <div key={r.id} className="card" style={{ padding: 14 }}>
        <div className="card-top" style={{ marginBottom: 0 }}>
          <span className="card-title" style={{ fontSize: 13 }}>{r.category} — {r.location}</span>
          <span className="badge" style={{ background: statusColor }}>{statusLabel}</span>
        </div>
      </div>
    );
  })
)}

      <BottomNav role="government" />
    </div>
  );
}