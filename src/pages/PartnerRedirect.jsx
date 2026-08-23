import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PartnerRedirect() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (role === "industrial") navigate("/verify", { replace: true });
    else if (role === "academia") navigate("/solve", { replace: true });
    else navigate("/", { replace: true });
  }, [role, loading, navigate]);

  return <div className="loading-screen">Signing you in...</div>;
}