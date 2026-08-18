import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import BottomNav from "../components/BottomNav";

const riskColors = { high: "#22d3c9", low: "#CC8400", pending: "#757575" };

export default function Ledger() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "ledger"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snap) => setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const filtered = entries.filter((e) => {
    const term = search.toLowerCase();
    return !term || [e.action, e.riskLevel].some((f) => (f || "").toLowerCase().includes(term));
  });

  return (
    <div className="page-wrap">
      <div className="page-title">Ledger / History</div>
      <p className="subtitle">Full audit trail, every report</p>
      <input className="field" placeholder="Search action or risk level" value={search} onChange={(e) => setSearch(e.target.value)} />
      {filtered.length === 0 ? (
        <div className="empty-state">{entries.length === 0 ? "No ledger entries yet" : "No entries match your search"}</div>
      ) : (
        filtered.map((e) => (
          <div key={e.id} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: riskColors[e.riskLevel] || "#757575", flexShrink: 0 }} />
              <span className="card-title">{e.action}</span>
            </div>
            {e.notifiedRoles?.length > 0 && (
              <div className="card-loc" style={{ marginTop: 6 }}>Notified: {e.notifiedRoles.join(", ")}</div>
            )}
          </div>
        ))
      )}
      <BottomNav />
    </div>
  );
}