import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Terms() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div className="page-wrap" style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="brand">CityWatch</div>
        <button className="lang-toggle-btn" onClick={toggleLang}>
          {lang === "en" ? "日本語" : "English"}
        </button>
      </div>
      <h1 className="page-title" style={{ marginTop: 8 }}>{t("termsTitle")}</h1>
      <p className="subtitle">{t("legalLastUpdated")}</p>

      <div style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7 }}>
        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("terms1Title")}</h3>
        <p>{t("terms1Body")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("terms2Title")}</h3>
        <p>{t("terms2Body")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("terms3Title")}</h3>
        <p>{t("terms3Body")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("terms4Title")}</h3>
        <p>{t("terms4Body")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("terms5Title")}</h3>
        <p>{t("terms5Body")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("terms6Title")}</h3>
        <p>{t("terms6Body")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("terms7Title")}</h3>
        <p>{t("terms7Body")}</p>
      </div>

      <Link className="link-btn" to="/" style={{ marginTop: 30 }}>{t("legalBackToCityWatch")}</Link>
    </div>
  );
}
