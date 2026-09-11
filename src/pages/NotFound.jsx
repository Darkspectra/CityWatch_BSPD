import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div className="page-wrap" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
        <div className="brand">CityWatch</div>
        <button className="lang-toggle-btn" onClick={toggleLang}>
          {lang === "en" ? "日本語" : "English"}
        </button>
      </div>
      <div style={{ marginTop: 60 }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: "var(--accent)" }}>404</div>
        <p className="page-title" style={{ marginTop: 8 }}>{t("notFoundTitle")}</p>
        <p className="subtitle" style={{ marginBottom: 24 }}>
          {t("notFoundBody")}
        </p>
        <Link className="btn btn-primary" to="/" style={{ display: "inline-block", width: "auto", padding: "12px 28px" }}>
          {t("notFoundBackBtn")}
        </Link>
      </div>
    </div>
  );
}
