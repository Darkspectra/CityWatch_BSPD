import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "../firebase";

export default function AuthAction() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (mode !== "verifyEmail" || !oobCode) {
      setStatus("error");
      return;
    }
    applyActionCode(auth, oobCode)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [mode, oobCode]);

  return (
    <div className="page-wrap" style={{ textAlign: "center" }}>
      <div className="brand">CityWatch</div>
      <div style={{ marginTop: 40 }}>
        {status === "verifying" && (
          <p className="subtitle">Verifying your email...</p>
        )}
        {status === "success" && (
          <>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <p className="page-title">Verification completed</p>
            <p className="subtitle">You can close this window now.</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="page-title">Link expired or already used</p>
            <p className="subtitle">You can close this window and try requesting a new link from your original tab.</p>
          </>
        )}
      </div>
    </div>
  );
}