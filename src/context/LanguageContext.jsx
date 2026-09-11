import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("cw_lang") || "en");

  useEffect(() => {
    localStorage.setItem("cw_lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ja" : "en"));

  const t = (key) => translations[key]?.[lang] || translations[key]?.en || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}