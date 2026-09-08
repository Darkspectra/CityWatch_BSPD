import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import HomeButton from "../components/HomeButton";
import BottomNav from "../components/BottomNav";

export default function SupportForm() {
  const { user, role, profile } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!subject.trim() || !message.trim()) { setError("Please fill both fields"); return; }
    try {
      await addDoc(collection(db, "supportTickets"), {
        userId: user.uid,
        userName: profile?.name || "Unknown",
        userEmail: profile?.email || user.email,
        userRole: role,
        subject,
        message,
        status: "open",
        createdAt: Timestamp.now(),
      });
      setSuccess("Your message has been sent to support. We'll get back to you.");
      setSubject(""); setMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-wrap">
      <HomeButton />
      <div className="page-title">Contact Support</div>
      <p className="subtitle">Having an issue? Let us know.</p>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input className="field" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea className="field" placeholder="Describe your issue" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="btn btn-primary" type="submit">Send to Support</button>
      </form>
      <BottomNav role={role} />
    </div>
  );
}