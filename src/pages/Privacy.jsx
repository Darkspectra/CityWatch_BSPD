import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Privacy() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div className="page-wrap" style={{ maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="brand">CityWatch</div>
        <button className="lang-toggle-btn" onClick={toggleLang}>
          {lang === "en" ? "日本語" : "English"}
        </button>
      </div>
      <h1 className="page-title" style={{ marginTop: 8 }}>{t("privacyTitle")}</h1>
      <p className="subtitle">{t("legalLastUpdated")}</p>

      <div style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7 }}>
        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("privacyCollectTitle")}</h3>
        <p>{t("privacyCollectBody")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("privacyUseTitle")}</h3>
        <p>{t("privacyUseBody")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("privacyThirdPartyTitle")}</h3>
        <p>{t("privacyThirdPartyBody")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("privacyRetentionTitle")}</h3>
        <p>{t("privacyRetentionBody")}</p>

        <h3 style={{ color: "var(--text)", marginTop: 24 }}>{t("privacyChoicesTitle")}</h3>
        <p>{t("privacyChoicesBody")}</p>
      </div>

      <Link className="link-btn" to="/" style={{ marginTop: 30 }}>{t("legalBackToCityWatch")}</Link>
    </div>
  );
}
