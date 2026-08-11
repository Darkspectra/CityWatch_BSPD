import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

export default function Submit() {
  const { user, role } = useAuth();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("chemical");
  const [sensorFlag, setSensorFlag] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!description.trim() || !location.trim()) { setError("Please fill description and location"); return; }

    const riskLevel = sensorFlag || category === "chemical" ? "high" : "low";
    const status = riskLevel === "high" ? "recovering" : "logged";
    const ledgerAction = riskLevel === "high" ? "backup_triggered" : "logged_quadruple_helix";
    const notifiedRoles = riskLevel === "high" ? ["government", "industrial"] : ["academia", "citizen"];

    try {
      const reportRef = await addDoc(collection(db, "reports"), {
        submittedBy: user.uid, submittedByRole: role,
        description, location, category, sensorFlag, riskLevel, status,
        timestamp: Timestamp.now()
      });
      await addDoc(collection(db, "ledger"), { reportId: reportRef.id, action: ledgerAction, riskLevel, notifiedRoles, timestamp: Timestamp.now() });
      setSuccess(`Report submitted — risk level: ${riskLevel}`);
      setDescription(""); setLocation(""); setSensorFlag(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-title">Submit a Report</div>
      <p className="subtitle">Help keep the city resilient</p>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={handleSubmit}>
        <textarea className="field" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="field" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="chemical">Chemical</option>
          <option value="water">Water</option>
          <option value="air">Air</option>
          <option value="waste">Waste</option>
          <option value="other">Other</option>
        </select>
        <label className="checkbox-row">
          <input type="checkbox" checked={sensorFlag} onChange={(e) => setSensorFlag(e.target.checked)} />
          Sensor anomaly detected
        </label>
        <button className="btn btn-primary" type="submit">Submit Report</button>
      </form>
      <BottomNav />
    </div>
  );
}