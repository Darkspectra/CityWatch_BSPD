import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import { compressImage } from "../utils/imageCompress";

export default function Submit() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("fire");
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [compressing, setCompressing] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      if (compressed.length > 700_000) {
        setError("Photo is too large even after compression — try a different photo.");
        setImageBase64(null);
        setImagePreview(null);
      } else {
        setImageBase64(compressed);
        setImagePreview(compressed);
      }
    } catch {
      setError("Couldn't process that photo. Try another one.");
    } finally {
      setCompressing(false);
    }
  };

  const removePhoto = () => {
    setImageBase64(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!description.trim() || !location.trim()) { setError("Please fill description and location"); return; }

    try {
      await addDoc(collection(db, "reports"), {
        submittedBy: user.uid,
        description, location, category,
        imageBase64: imageBase64 || null,
        verificationStatus: "pending",
        solved: false,
        noticePublished: false,
        status: "submitted",
        timestamp: Timestamp.now()
      });
      setSuccess("Report submitted — an Industrial reviewer will verify it shortly.");
      setDescription(""); setLocation(""); setImageBase64(null); setImagePreview(null);
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

        <label className="photo-upload-label">
          {compressing ? "Processing photo..." : imagePreview ? "Change photo" : "Add a photo (optional)"}
          <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: "none" }} />
        </label>

        {imagePreview && (
          <div className="photo-preview-wrap">
            <img src={imagePreview} alt="Report preview" className="photo-preview" />
            <button type="button" className="photo-remove-btn" onClick={removePhoto}>Remove</button>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={compressing}>Submit Report</button>
      </form>
      <BottomNav role="citizen" />
    </div>
  );
}