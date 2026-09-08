import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import HomeButton from "../components/HomeButton";
import BottomNav from "../components/BottomNav";
import { useToast } from "../context/ToastContext";

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "supportTickets"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const markResolved = async (id) => {
    await updateDoc(doc(db, "supportTickets", id), { status: "resolved" });
    showToast("Ticket marked resolved");
  };

  return (
    <div className="page-wrap">
      <HomeButton />
      <div className="page-title">Support Tickets</div>
      <p className="subtitle">Issues submitted by users</p>

      {tickets.length === 0 ? (
        <div className="empty-state">No support tickets yet.</div>
      ) : (
        tickets.map((t) => (
          <div key={t.id} className="card">
            <div className="card-top">
              <span className="card-title">{t.subject}</span>
              <span className="badge" style={{ background: t.status === "resolved" ? "#4ade80" : "#CC8400" }}>
                {t.status}
              </span>
            </div>
            <div className="card-desc">{t.message}</div>
            <div className="card-loc">{t.userName} ({t.userRole}) · {t.userEmail}</div>
            {t.status !== "resolved" && (
              <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => markResolved(t.id)}>
                Mark Resolved
              </button>
            )}
          </div>
        ))
      )}
      <BottomNav role="government" />
    </div>
  );
}