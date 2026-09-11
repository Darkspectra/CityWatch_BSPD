import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import HomeButton from "../components/HomeButton";

export default function VerifyEmailGate() {
  const { user, role, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user || justVerified) return;
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        setJustVerified(true);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [user, justVerified]);

  const resend = async () => {
    setSending(true);
    try {
      await sendEmailVerification(auth.currentUser, {
        url: "https://task-management-d6dee.web.app/auth-action",
      });
      showToast("Verification email sent — check your inbox");
    } catch {
      showToast("Couldn't send email — try again in a minute");
    } finally {
      setSending(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };


    const goToDashboard = () => {
      if (role === "citizen") navigate("/dashboard", { replace: true });
      else if (role === "industrial") navigate("/verify", { replace: true });
      else if (role === "academia") navigate("/solve", { replace: true });
      else navigate("/", { replace: true });
    };

  if (justVerified) {
    return (
      <div className="page-wrap" style={{ textAlign: "center" }}>
        <HomeButton />
        <div className="brand">CityWatch</div>
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <p className="page-title" style={{ marginBottom: 8 }}>Verification has been done</p>
          <p className="subtitle" style={{ marginBottom: 24 }}>Your email is confirmed — you're ready to go.</p>
          <button className="btn btn-primary" onClick={goToDashboard} style={{ maxWidth: 280, margin: "0 auto" }}>
            Proceed to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap" style={{ textAlign: "center" }}>
      <HomeButton />
      <div className="brand">CityWatch</div>
      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
        <p className="page-title" style={{ marginBottom: 8 }}>Verify your email</p>
        <p className="subtitle" style={{ marginBottom: 24 }}>
          We sent a verification link to <strong>{user?.email}</strong>. Click it, then come back to this tab.
        </p>
        <button className="btn btn-primary" onClick={resend} disabled={sending} style={{ maxWidth: 280, margin: "0 auto 10px" }}>
          {sending ? "Sending..." : "Resend verification email"}
        </button>
        <button className="btn btn-secondary" onClick={handleSignOut} style={{ maxWidth: 280, margin: "0 auto" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}