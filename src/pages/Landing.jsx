import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="page-wrap">
      <div className="brand">CityWatch</div>
      <p className="subtitle">Every signal seen, every answer verified.</p>

      <div className="role-grid">
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
        </Link>
      </div>
    </div>
  );
}