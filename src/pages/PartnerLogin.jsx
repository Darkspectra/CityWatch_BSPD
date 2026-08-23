import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { friendlyAuthError } from "../utils/authErrors";
import PasswordField from "../components/PasswordField";
import RoleBadge from "../components/RoleBadge";

export default function PartnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      if (role === "industrial" || role === "academia") {
        navigate("/partner/redirect", { replace: true });
      } else if (role) {
        setError("This account is not registered as Industrial or Academia.");
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email above first, then tap \"Forgot password?\"");
      return;
    }
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent");
    } catch (err) {
      setError(friendlyAuthError(err));
    }
  };

  return (
    <div className="page-wrap">
      <div className="brand">CityWatch</div>
      <RoleBadge role="partner" label="Industrial / Academia sign in" />
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="partner-email">Email</label>
          <input id="partner-email" className="field" type="email" autoComplete="email" placeholder="you@organization.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="button" className="forgot-password" onClick={handleForgotPassword}>Forgot password?</button>
        <button className="btn btn-primary" type="submit">Sign In</button>
      </form>
      {notRegistered && (
        <Link className="link-btn" to="/partner/signup" style={{ borderColor: "var(--accent)" }}>
          No account found — Sign up instead
        </Link>
      )}
      <Link className="link-btn" to="/partner/signup">Don't have an account? Sign up</Link>
      <Link className="text-link" to="/">← Back</Link>
    </div>
  );
}