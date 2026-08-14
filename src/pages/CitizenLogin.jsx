import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { friendlyAuthError } from "../utils/authErrors";

export default function CitizenLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (role === "citizen") {
        navigate("/dashboard", { replace: true });
      } else if (role) {
        setError("This account is not registered as a Citizen.");
      }
    }
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotRegistered(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const code = err?.code || "";
      setNotRegistered(code === "auth/user-not-found" || code === "auth/invalid-credential" || code === "auth/wrong-password");
      setError(friendlyAuthError(err));
    }
  };

  return (
    <div className="page-wrap">
      <div className="brand">CityWatch</div>
      <p className="subtitle">Citizen sign in</p>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary" type="submit">Sign In</button>
      </form>
      {notRegistered && (
        <Link className="link-btn" to="/citizen/signup" style={{ borderColor: "var(--accent)" }}>
          No account found — Sign up instead
        </Link>
      )}
      <Link className="link-btn" to="/citizen/signup">Don't have an account? Sign up</Link>
      <Link className="link-btn" to="/" style={{ marginTop: 6, opacity: 0.7 }}>← Back</Link>
    </div>
  );
}