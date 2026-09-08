import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cw_cookie_consent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cw_cookie_consent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        CityWatch uses essential cookies/local storage for login sessions and preferences.
        By continuing, you agree to our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <button className="cookie-accept-btn" onClick={accept}>Got it</button>
    </div>
  );
}