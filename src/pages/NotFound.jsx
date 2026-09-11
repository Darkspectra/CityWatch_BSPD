import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-wrap" style={{ textAlign: "center" }}>
      <div className="brand">CityWatch</div>
      <div style={{ marginTop: 60 }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: "var(--accent)" }}>404</div>
        <p className="page-title" style={{ marginTop: 8 }}>Page not found</p>
        <p className="subtitle" style={{ marginBottom: 24 }}>
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link className="btn btn-primary" to="/" style={{ display: "inline-block", width: "auto", padding: "12px 28px" }}>
          Back to CityWatch
        </Link>
      </div>
    </div>
  );
}