import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import {
  LANGUAGE_STORAGE_KEY,
  applyDocumentLanguage,
  fallbackLocale,
  supportedLocales,
} from "./config";
import { resources } from "./resources";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: fallbackLocale,
      supportedLngs: supportedLocales.map(({ code }) => code),
      ns: ["common", "prayers"],
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      },
    });
}

applyDocumentLanguage(i18n.resolvedLanguage || i18n.language || fallbackLocale);
i18n.on("languageChanged", applyDocumentLanguage);

export default i18n;
