export const LANGUAGE_STORAGE_KEY = "globalprayers.language";

export const supportedLocales = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", dir: "rtl" },
];

export const fallbackLocale = "en";

export const getSupportedLanguage = (language = fallbackLocale) => {
  const normalizedLanguage = String(language).split("-")[0];

  return supportedLocales.some(({ code }) => code === normalizedLanguage)
    ? normalizedLanguage
    : fallbackLocale;
};

export const getLanguageDirection = (language = fallbackLocale) =>
  supportedLocales.find(({ code }) => code === getSupportedLanguage(language))?.dir ?? "ltr";

export const applyDocumentLanguage = (language = fallbackLocale) => {
  const supportedLanguage = getSupportedLanguage(language);

  document.documentElement.setAttribute("lang", supportedLanguage);
  document.documentElement.setAttribute("dir", getLanguageDirection(supportedLanguage));
  localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage);
};
