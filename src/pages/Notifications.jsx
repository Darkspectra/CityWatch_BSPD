import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

export default function Notifications() {
  const { role } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  return (
    <div className="page-wrap">
      <div className="page-title">Notices</div>
      <p className="subtitle">Official updates from Government</p>

      {items.length === 0 ? (
        <div className="empty-state">No notices yet.</div>
      ) : (
        items.map((n) => (
          <div key={n.id} className="card">
            <span className="badge" style={{ background: n.type === "alert" ? "#B33B24" : "#4ade80" }}>
              {n.type === "alert" ? "Alert" : "Resolved"}
            </span>
            <div className="card-title" style={{ marginTop: 8 }}>{n.title}</div>
            <div className="card-desc">{n.message}</div>
          </div>
        ))
      )}
      <BottomNav role={role} />
    </div>
  );
}