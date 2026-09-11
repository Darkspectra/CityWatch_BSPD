import { Link } from "react-router-dom";
import "./LandingPage.css";
import ParticleNetwork from "../components/ParticleNetwork";
import Globe from "../components/Globe";
import GlobalContextPanel from "../components/GlobalContextPanel";
import bspdLogo from "../assets/bspd-favicon.png";
import bspdBadge from "../assets/bspd-badge.png";
import androidQr from "../assets/android-qr.png";

const ANDROID_APK_URL = "https://drive.google.com/file/d/11x1HNVueosGNIvL5DHIqvdx3lfZjOiJi/view?usp=sharing";

const mockReports = [
  { cat: "Chemical Spill", loc: "Sector 4 — Riverside", status: "submitted", statusColor: "#B33B24", risk: "high", riskColor: "#22d3c9" },
  { cat: "Water Quality", loc: "District 7 — Main Pipeline", status: "triaged", statusColor: "#4B3F8F", risk: "low", riskColor: "#CC8400" },
  { cat: "Air Emission", loc: "Industrial Zone B", status: "recovering", statusColor: "#00796B", risk: "high", riskColor: "#22d3c9" },
  { cat: "Waste Overflow", loc: "Block 12 — Landfill", status: "logged", statusColor: "#CC8400", risk: "pending", riskColor: "#757575" },
];

export default function LandingPage() {


  function handleMockupTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 (left) → 0.5 (right)
  const y = (e.clientY - rect.top) / rect.height - 0.5;   // -0.5 (top) → 0.5 (bottom)

  const rotateY = x * 18;   // left/right tilt
  const rotateX = -y * 18;  // up/down tilt

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
}

function resetMockupTilt(e) {
  e.currentTarget.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
}




  return (
    <div className="lp">
      {/* ── Nav ── */}
      <nav className="lp-nav" id="lp-top">
       <span className="lp-nav-brand">CityWatch</span>
       <div className="lp-nav-links">
        <a href="#how-it-works" className="lp-nav-hide-mobile">How It Works</a>
        <a href="#about" className="lp-nav-hide-mobile">About Us</a>
        <a href="#resilient-city" className="lp-nav-hide-mobile">A Resilient City</a>
        <Link to="/start" className="lp-nav-login">Log In</Link>
        <img src={bspdBadge} alt="BSPD" className="lp-nav-badge-img" />
      </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero" id="hero">
        <div className="lp-panel-particles"><ParticleNetwork /></div>
        <div className="lp-hero-inner">
        <div className="lp-hero-text">
          <h1>City-Scale Environmental Intelligence</h1>
            <p>
              CityWatch connects citizens, industry reviewers, and government agencies
              on a single platform to report, verify, and resolve environmental hazards
              — with full transparency and a resilient-city framework built in.
            </p>
            <div className="lp-hero-actions">
              <Link to="/start" className="lp-btn-primary">
                Get Started
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="#how-it-works" className="lp-btn-secondary">See How It Works</a>
            </div>
          </div>

          <div className="lp-mockup">
          <div className="lp-mockup-window">
            <div className="lp-mockup-logo-row">
              <img src={bspdLogo} alt="BSPD" className="lp-mockup-logo-img" />
            </div>
            <div className="lp-mockup-bar">
                <span className="lp-mockup-dot" style={{ background: "#ff5f57" }} />
                <span className="lp-mockup-dot" style={{ background: "#febc2e" }} />
                <span className="lp-mockup-dot" style={{ background: "#28c840" }} />
                <span className="lp-mockup-bar-title">CityWatch — Dashboard</span>
              </div>
              <div className="lp-mockup-body">
                {mockReports.map((r, i) => (
                  <div className="lp-mock-card" key={i}>
                    <div className="lp-mock-left">
                      <span className="lp-mock-cat">{r.cat}</span>
                      <span className="lp-mock-loc">{r.loc}</span>
                    </div>
                    <div className="lp-mock-right">
                      <span className="lp-mock-risk" style={{ background: r.riskColor }} title={`${r.risk} risk`} />
                      <span className="lp-mock-badge" style={{ background: r.statusColor }}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lp-scroll-hint">
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      </section>

      {/* ── Role Cards ── */}
      <section className="lp-roles" id="roles">
        <h2>Choose Your Role</h2>
        <div className="lp-roles-grid">
          <Link to="/citizen/signup" className="lp-role-card">
            <span className="lp-role-icon">🏠</span>
            <h3>Citizens</h3>
            <p>Report environmental issues in your neighborhood — chemical spills, air quality, water contamination.</p>
            <span className="lp-role-cta">Report an Issue →</span>
          </Link>
          <Link to="/partner/signup" className="lp-role-card">
            <span className="lp-role-icon">🏭</span>
            <h3>Industry & Reviewers</h3>
            <p>Verify citizen reports, run sensor diagnostics, and triage incidents by risk level.</p>
            <span className="lp-role-cta">Start Verifying →</span>
          </Link>
          <Link to="/gov/login" className="lp-role-card">
            <span className="lp-role-icon">🏛️</span>
            <h3>Government Partners</h3>
            <p>Publish official resolutions, track city-wide trends, and close the loop with the public.</p>
            <span className="lp-role-cta">Sign In as Partner →</span>
          </Link>
        </div>
      </section>

      <hr className="lp-divider" />

      {/* ── How It Works ── */}
      <section className="lp-how" id="how-it-works">
        <div className="lp-how-inner">
          <p className="lp-section-label">Process</p>
          <h2 className="lp-section-title">How It Works</h2>
          <div className="lp-steps">
            <div className="lp-step">
              <span className="lp-step-num">1</span>
              <h3>Report</h3>
              <p>Citizens submit environmental reports with descriptions, locations, and optional sensor flags.</p>
            </div>
            <div className="lp-step">
              <span className="lp-step-num">2</span>
              <h3>Verify</h3>
              <p>Industry reviewers and academia triage reports, confirm sensor data, and assess risk levels.</p>
            </div>
            <div className="lp-step">
              <span className="lp-step-num">3</span>
              <h3>Resolve</h3>
              <p>Academia tracks the verified issue until it's fixed, then flags it as solved.</p>
            </div>
            <div className="lp-step">
              <span className="lp-step-num">4</span>
              <h3>Announce</h3>
              <p>Government publishes one clear, trusted notice the whole city can see.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Us — two-column layout ── */}
      <section className="lp-section" id="about">
        <div className="lp-about-grid">
          <div>
            <p className="lp-section-label">About Us</p>
            <h2 className="lp-section-title">Building Safer Cities Together</h2>
            <p className="lp-section-body">
              CityWatch is a collaborative platform built on the Quadruple Helix
              model — connecting citizens, industry, government, and academia to
              create a transparent, data-driven approach to urban environmental
              safety. Every report is logged on an immutable ledger, every risk
              level is assessed with sensor-backed data, and every resolution is
              published for public accountability.
            </p>
          </div>
          <div className="lp-about-visual">
            <div className="lp-about-stat">
              <span className="lp-about-stat-icon">📡</span>
              <span>Sensor-Backed Reports</span>
            </div>
            <div className="lp-about-stat">
              <span className="lp-about-stat-icon">🔒</span>
              <span>Immutable Ledger</span>
            </div>
            <div className="lp-about-stat">
              <span className="lp-about-stat-icon">🌐</span>
              <span>Quadruple Helix Model</span>
            </div>
            <div className="lp-about-stat">
              <span className="lp-about-stat-icon">⚡</span>
              <span>Real-Time Risk Alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── A Resilient City, Modeled ── */}
      <section className="lp-resilient" id="resilient-city">
        <div className="lp-panel-particles"><ParticleNetwork /></div>
        <div className="lp-resilient-inner">
          <div className="lp-resilient-top">
            <div>
              <p className="lp-section-label">Resilience Framework</p>
              <h2 className="lp-section-title">A Resilient City, Modeled</h2>
              <p className="lp-section-body">
                Our platform models urban resilience across environmental, social, and
                infrastructural dimensions — turning reactive crisis management into
                proactive city planning.
              </p>
            </div>
            <div className="lp-resilient-globe">
              <Globe size={620} />
            </div>
          </div>
          <div className="lp-resilient-grid">
            <div className="lp-resilient-card">
              <h3>Environmental Monitoring</h3>
              <p>Track air, water, chemical, and waste indicators across city sectors with citizen and sensor data fusion.</p>
            </div>
            <div className="lp-resilient-card">
              <h3>Risk Classification</h3>
              <p>Automated risk scoring (high / low / pending) routes reports to the right stakeholders instantly.</p>
            </div>
            <div className="lp-resilient-card">
              <h3>Multi-Stakeholder Response</h3>
              <p>Government, industry, and academia coordinate through a shared ledger — no more siloed crisis response.</p>
            </div>
            <div className="lp-resilient-card">
              <h3>Public Transparency</h3>
              <p>Every report, triage action, and resolution is visible on the public ledger for full accountability.</p>
            </div>
          </div>
          <GlobalContextPanel />
        </div>
      </section>

      {/* ── Get the App ── */}
      <section className="lp-getapp" id="get-app">
        <div className="lp-getapp-inner">
          <div>
            <p className="lp-section-label">Mobile App</p>
            <h2 className="lp-section-title">Take CityWatch With You</h2>
            <p className="lp-section-body">
              Report and track environmental issues on the go with the CityWatch
              Android app. Scan the QR code with your phone's camera to download,
              or use the button below.
            </p>
            <a
              href={ANDROID_APK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary lp-getapp-btn"
            >
              Download for Android
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 3v13M6 11l6 6 6-6M5 21h14"/></svg>
            </a>
          </div>
          <div className="lp-getapp-qr-card">
            <img src={androidQr} alt="Scan to download the CityWatch Android app" className="lp-getapp-qr-img" />
            <span className="lp-getapp-qr-label">Scan to download</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
        {/* ── Footer ── */}
      <footer className="lp-footer">
      <div className="lp-footer-top-row">
        <img src={bspdBadge} alt="BSPD" className="lp-footer-badge-img" />
        <span className="lp-footer-brand"></span>
      </div>
        <div className="lp-footer-names">
          <span>Nodoka Kakoi</span>
          <span className="lp-footer-sep">|</span>
          <span>Daniel Azarya Tafuama</span>
          <span className="lp-footer-sep">|</span>
          <span>Patricia Aira Dy Herrera</span>
          <span className="lp-footer-sep">|</span>
          <span>Farhan Tanvir Ahmed</span>
        </div>
        <span className="lp-footer-tag">EBA Minamata — 2026</span>
      </footer>
    </div>
  );
}