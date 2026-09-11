import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="page-wrap" style={{ maxWidth: 700 }}>
      <div className="brand">CityWatch</div>
      <h1 className="page-title" style={{ marginTop: 8 }}>Terms & Conditions</h1>
      <p className="subtitle">Last updated: September 2026</p>

      <div style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7 }}>
        <h3 style={{ color: "var(--text)", marginTop: 24 }}>1. About CityWatch</h3>
        <p>CityWatch is an academic project (EBA 2026, Group BSPD) built to demonstrate a resilient-city reporting platform connecting Citizens, Industrial reviewers, Academia, and Government. It is provided for educational and demonstration purposes.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>2. Accounts</h3>
        <p>You must provide accurate information when creating an account. You are responsible for keeping your login credentials secure. Government accounts are provisioned separately and are not available for public signup.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>3. Content You Submit</h3>
        <p>By submitting a report (including any photo), you confirm the content is accurate to your knowledge and that you have the right to share it. Do not submit false reports, offensive content, or content that violates others' privacy or rights.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>4. Data Storage</h3>
        <p>Report data, including submitted photos, is stored using Firebase (Google Cloud). Location data submitted or confirmed via the map feature is processed using OpenStreetMap's Nominatim service.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>5. No Warranty</h3>
        <p>CityWatch is provided "as is" as a student project without warranty of any kind. It is not an official emergency service — for real emergencies, always contact local emergency services directly.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>6. Changes</h3>
        <p>These terms may be updated as the project evolves. Continued use of CityWatch after changes constitutes acceptance of the updated terms.</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>7. Contact</h3>
        <p>Questions can be submitted through the in-app Support tab (once signed in) or directed to the CityWatch project team, Group BSPD.</p>
      </div>

      <Link className="link-btn" to="/" style={{ marginTop: 30 }}>← Back to CityWatch</Link>
    </div>
  );
}