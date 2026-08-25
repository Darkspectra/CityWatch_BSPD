import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowed, children, requireVerified = true }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading CityWatch...</div>;
  if (!user) return <Navigate to="/" replace />;

  // role can briefly be "" while the user doc snapshot is still resolving —
  // wait rather than bounce immediately
  if (!role) return <div className="loading-screen">Loading CityWatch...</div>;

  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  if (requireVerified && role !== "government" && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
}