import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import Globe from "../components/Globe";
import Footer from "../components/Footer";
import PixelFooter from "../components/PixelFooter";

export default function Home() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="home-nav-brand">CityWatch</div>
        <div className="home-nav-links">
          <span onClick={() => scrollTo("how-it-works")}>How It Works</span>
          <span onClick={() => scrollTo("about")}>About Us</span>
          <span onClick={() => scrollTo("earth")}>Resilient Earth</span>
        </div>
        <button className="home-nav-cta" onClick={() => navigate("/start")}>Get Started</button>
      </nav>

      <HeroSection onGetStarted={() => navigate("/start")} />
      <HowItWorksSection />
      <EarthSection />
      <AboutSection />
      <FinalCtaSection onGetStarted={() => navigate("/start")} />
      <Footer />
    </div>
  );
}

function HeroSection({ onGetStarted }) {
  return (
    <section className="home-hero">
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <h1 className="home-hero-title">
        Every signal seen.<br />Every answer verified.
      </h1>
      <p className="home-hero-sub">
        CityWatch turns scattered street-level observations into confirmed, actionable knowledge —
        reported by citizens, verified by experts, resolved for everyone.
      </p>
      <button className="btn btn-primary home-hero-btn" onClick={onGetStarted}>Get Started</button>
      <div className="scroll-hint">
        <div className="scroll-hint-dot" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const [ref, visible] = useScrollReveal();
  const steps = [
    { title: "Report", desc: "A citizen notices smoke, a chemical smell, or floodwater — and reports it in seconds." },
    { title: "Verify", desc: "Industrial reviewers confirm whether the report reflects a real, serious issue on the ground." },
    { title: "Resolve", desc: "Academia tracks the verified issue until it's fixed, then flags it as solved." },
    { title: "Announce", desc: "Government publishes one clear, trusted notice the whole city can see." },
  ];

  return (
    <section id="how-it-works" ref={ref} className={"home-section" + (visible ? " reveal-in" : "")}>
      <h2 className="home-section-title">How It Works</h2>
      <p className="home-section-sub">A verified pipeline from observation to resolution.</p>
      <div className="steps-grid">
        {steps.map((s, i) => (
          <div key={s.title} className="step-card" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="step-number">{i + 1}</div>
            <div className="step-title">{s.title}</div>
            <div className="step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EarthSection() {
  const [ref, visible] = useScrollReveal();
  return (
    <section id="earth" ref={ref} className={"home-section" + (visible ? " reveal-in" : "")}>
      <h2 className="home-section-title">A Resilient City, Modeled</h2>
      <p className="home-section-sub">
        Resilience isn't abstract — it's built city by city, signal by signal, across a connected world.
      </p>
      <Globe />
    </section>
  );
}

function AboutSection() {
  const [ref, visible] = useScrollReveal();
  return (
    <section id="about" ref={ref} className={"home-section" + (visible ? " reveal-in" : "")}>
      <h2 className="home-section-title">About Us</h2>
      <p className="home-section-sub" style={{ maxWidth: 640, margin: "0 auto" }}>
        CityWatch was built on a simple belief: resilient cities aren't built by any single authority —
        they're built when citizens, industry, researchers, and government all see the same truth at the
        same time. Instead of reports disappearing into a queue, CityWatch makes every stage of resolution
        visible, verified, and accountable. No noise, no guessing — just a shared, trusted record of what's
        happening in the city and what's already been fixed.
      </p>
    </section>
  );
}

function FinalCtaSection({ onGetStarted }) {
  const [ref, visible] = useScrollReveal();
  return (
    <section ref={ref} className={"home-section home-final-cta" + (visible ? " reveal-in" : "")}>
      <h2 className="home-section-title">Ready to make your city more resilient?</h2>
      <button className="btn btn-primary home-hero-btn" onClick={onGetStarted}>Get Started</button>
      <PixelFooter />
    </section>
  );
}