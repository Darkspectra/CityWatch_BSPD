import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import PasswordField from "../components/PasswordField";
import RoleBadge from "../components/RoleBadge";

export default function PartnerSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("industrial");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/partner/redirect", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), { name, email, role });
      // navigation happens automatically via the useEffect above once AuthContext updates
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-wrap">
      <div className="brand">CityWatch</div>
      <RoleBadge role="partner" label="Industrial / Academia sign up" />
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="partner-name">Organization / Name</label>
          <input id="partner-name" className="field" autoComplete="organization" placeholder="Acme Labs" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="partner-signup-email">Email</label>
          <input id="partner-signup-email" className="field" type="email" autoComplete="email" placeholder="you@organization.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        <div className="field-group">
          <label className="field-label" htmlFor="partner-role">Account type</label>
          <select id="partner-role" className="field" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="industrial">Industrial</option>
            <option value="academia">Academia / Researcher</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Sign Up</button>
      </form>
      <Link className="link-btn" to="/partner/login">Already have an account? Sign in</Link>
      <Link className="text-link" to="/">← Back</Link>
    </div>
  );
}