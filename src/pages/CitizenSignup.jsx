import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
import PasswordField from "../components/PasswordField";
import RoleBadge from "../components/RoleBadge";
=======
>>>>>>> 36f17f78c5fce32c9eddd775c3ebd3c8642d91a9

export default function CitizenSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), { name, email, role: "citizen" });
      // navigation happens automatically via the useEffect above once AuthContext updates
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-wrap">
      <div className="brand">CityWatch</div>
<<<<<<< HEAD
      <RoleBadge role="citizen" label="Create your citizen account" />
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="citizen-name">Name</label>
          <input id="citizen-name" className="field" autoComplete="name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field-group">
          <label className="field-label" htmlFor="citizen-signup-email">Email</label>
          <input id="citizen-signup-email" className="field" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        <button className="btn btn-primary" type="submit">Sign Up</button>
      </form>
      <Link className="link-btn" to="/citizen/login">Already have an account? Sign in</Link>
      <Link className="text-link" to="/">← Back</Link>
=======
      <p className="subtitle">Create your citizen account</p>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Sign Up</button>
      </form>
      <Link className="link-btn" to="/citizen/login">Already have an account? Sign in</Link>
>>>>>>> 36f17f78c5fce32c9eddd775c3ebd3c8642d91a9
    </div>
  );
}