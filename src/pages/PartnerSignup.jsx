import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";

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
      <p className="subtitle">Industrial / Academia sign up</p>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="field" placeholder="Organization / Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select className="field" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="industrial">Industrial</option>
          <option value="academia">Academia / Researcher</option>
        </select>
        <button className="btn btn-primary" type="submit">Sign Up</button>
      </form>
      <Link className="link-btn" to="/partner/login">Already have an account? Sign in</Link>
    </div>
  );
}