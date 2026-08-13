import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

export default function Submit() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("fire");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!description.trim() || !location.trim()) { setError("Please fill description and location"); return; }

    try {
      await addDoc(collection(db, "reports"), {
        submittedBy: user.uid,
        description, location, category,
        verificationStatus: "pending",
        solved: false,
        noticePublished: false,
        status: "submitted",
        timestamp: Timestamp.now()
      });
      setSuccess("Report submitted — an Industrial reviewer will verify it shortly.");
      setDescription(""); setLocation("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-title">Submit a Report</div>
      <p className="subtitle">What did you see?</p>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={handleSubmit}>
        <textarea className="field" placeholder="Describe what you observed" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="field" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="fire">Fire</option>
          <option value="chemical">Chemical Spill</option>
          <option value="water">Water Pollution</option>
          <option value="air">Air Pollution</option>
          <option value="natural_disaster">Natural Disaster</option>
          <option value="other">Other</option>
        </select>
        <button className="btn btn-primary" type="submit">Submit Report</button>
      </form>
      <BottomNav role="citizen" />
    </div>
  );
}