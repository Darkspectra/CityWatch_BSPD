import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowed, children }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading CityWatch...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return children;
}