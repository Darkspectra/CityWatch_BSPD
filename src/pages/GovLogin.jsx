import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { friendlyAuthError } from "../utils/authErrors";
import PasswordField from "../components/PasswordField";
import RoleBadge from "../components/RoleBadge";

export default function GovLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      if (role === "government") {
        navigate("/gov", { replace: true });
      } else if (role) {
        setError("This account is not authorized as Government.");
      }
    }
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
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
      <RoleBadge role="gov" label="Government sign in" />
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label className="field-label" htmlFor="gov-email">Email</label>
          <input id="gov-email" className="field" type="email" autoComplete="email" placeholder="you@agency.gov" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="button" className="forgot-password" onClick={handleForgotPassword}>Forgot password?</button>
        <button className="btn btn-primary" type="submit">Sign In</button>
      </form>
      <p className="helper-note">Government accounts are provisioned by your agency admin — contact them for access.</p>
      <Link className="text-link" to="/">← Back</Link>
    </div>
  );
}