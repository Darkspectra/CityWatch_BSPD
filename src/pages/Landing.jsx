import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const phrases = [
  "Reported by many.",
  "Verified by experts.",
  "Resolved for all.",
];

export default function Landing() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrap">
      <div className="brand">CityWatch</div>
      <p className="subtitle">Every signal seen, every answer verified.</p>

      <div className="hero-motto">
        <span key={index} className="hero-motto-text">{phrases[index]}</span>
      </div>

      <div className="role-grid">
<<<<<<< HEAD
        <Link to="/citizen/login" className="role-tile role-citizen">
          <div className="role-icon">👁</div>
          <div className="role-tile-body">
            <div className="role-tile-title">Citizen</div>
            <div className="role-tile-desc">Report what you see</div>
          </div>
          <span className="role-tile-chevron" aria-hidden="true">›</span>
        </Link>

        <Link to="/partner/login" className="role-tile role-partner">
          <div className="role-icon">🔬</div>
          <div className="role-tile-body">
            <div className="role-tile-title">Industrial / Academia</div>
            <div className="role-tile-desc">Verify & resolve reports</div>
          </div>
          <span className="role-tile-chevron" aria-hidden="true">›</span>
        </Link>

        <Link to="/gov/login" className="role-tile role-gov">
          <div className="role-icon">🏛</div>
          <div className="role-tile-body">
            <div className="role-tile-title">Government</div>
            <div className="role-tile-desc">Publish official notices</div>
          </div>
          <span className="role-tile-chevron" aria-hidden="true">›</span>
=======
        <Link to="/citizen/login" className="role-tile">
          <div className="role-icon">👁</div>
          <div className="role-tile-title">Citizen</div>
          <div className="role-tile-desc">Report what you see</div>
        </Link>

        <Link to="/partner/login" className="role-tile">
          <div className="role-icon">🔬</div>
          <div className="role-tile-title">Industrial / Academia</div>
          <div className="role-tile-desc">Verify & resolve reports</div>
        </Link>

        <Link to="/gov/login" className="role-tile" style={{ gridColumn: "1 / -1" }}>
          <div className="role-icon">🏛</div>
          <div className="role-tile-title">Government</div>
          <div className="role-tile-desc">Publish official notices</div>
>>>>>>> 36f17f78c5fce32c9eddd775c3ebd3c8642d91a9
        </Link>
      </div>
    </div>
  );
}