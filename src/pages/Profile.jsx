import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const initial = (profile?.name || "?")[0].toUpperCase();

  return (
    <div className="page-wrap">
      <div className="avatar">{initial}</div>
      <div className="page-title" style={{ textAlign: "center", marginBottom: 24 }}>Profile</div>
      <div className="profile-row"><div className="profile-label">Name</div><div className="profile-value">{profile?.name || "—"}</div></div>
      <div className="profile-row"><div className="profile-label">Email</div><div className="profile-value">{profile?.email || "—"}</div></div>
      <div className="profile-row"><div className="profile-label">Role</div><div className="profile-value">{profile?.role || "—"}</div></div>
      <button className="btn btn-secondary" onClick={handleSignOut}>Sign Out</button>
      <BottomNav />
    </div>
  );
}