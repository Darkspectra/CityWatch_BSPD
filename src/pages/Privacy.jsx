import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="page-wrap" style={{ maxWidth: 700 }}>
      <div className="brand">CityWatch</div>
      <h1 className="page-title" style={{ marginTop: 8 }}>Privacy Policy</h1>
      <p className="subtitle">Last updated: September 2026</p>

      <div style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7 }}>
        <h3 style={{ color: "var(--text)", marginTop: 24 }}>Information We Collect</h3>
        <p>Name, email address, and role (Citizen, Industrial, Academia, or Government) when you register. Report content you submit, including description, location, and any photo. Basic usage data through Firebase Authentication.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>How We Use It</h3>
        <p>To operate the platform's core function: routing reports through verification, resolution, and public announcement stages. To send email verification links. To display reports to the appropriate roles as described in the app.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>Third-Party Services</h3>
        <p>Firebase (Google) for authentication and data storage. OpenStreetMap Nominatim for location search. Google Gemini API for the CityWatch Assistant chatbot — messages sent to the assistant are processed by Google's Gemini API.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>Data Retention</h3>
        <p>As an academic project, data may be reset or deleted periodically. This is not a production system intended for long-term data retention.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>Your Choices</h3>
        <p>You may request account deletion by contacting the team via the Support tab.</p>
      </div>

      <Link className="link-btn" to="/" style={{ marginTop: 30 }}>← Back to CityWatch</Link>
    </div>
  );
}