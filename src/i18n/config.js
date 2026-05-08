export const LANGUAGE_STORAGE_KEY = "globalprayers.language";

export const supportedLocales = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", dir: "rtl" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", dir: "ltr" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", dir: "ltr" },
  { code: "fa", label: "Persian", nativeLabel: "فارسی", dir: "rtl" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", dir: "ltr" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
  { code: "fr", label: "French", nativeLabel: "Français", dir: "ltr" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", dir: "ltr" },
  { code: "ps", label: "Pashto", nativeLabel: "پښتو", dir: "rtl" },
  { code: "pa", label: "Punjabi", nativeLabel: "پنجابی", dir: "rtl" },
  { code: "de", label: "German", nativeLabel: "Deutsch", dir: "ltr" },
  { code: "es", label: "Spanish", nativeLabel: "Español", dir: "ltr" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", dir: "ltr" },
  { code: "zh-CN", label: "Chinese Simplified", nativeLabel: "简体中文", dir: "ltr" },
  { code: "zh-TW", label: "Chinese Traditional", nativeLabel: "繁體中文", dir: "ltr" },
  { code: "so", label: "Somali", nativeLabel: "Soomaali", dir: "ltr" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", dir: "ltr" },
];

export const fallbackLocale = "en";

export const getSupportedLanguage = (language = fallbackLocale) => {
  const requestedLanguage = String(language);
  const exactLanguage = supportedLocales.find(
    ({ code }) => code.toLowerCase() === requestedLanguage.toLowerCase()
  )?.code;

  if (exactLanguage) {
    return exactLanguage;
  }

  const normalizedLanguage = requestedLanguage.split("-")[0].toLowerCase();
  const baseLanguage = supportedLocales.find(
    ({ code }) => code.toLowerCase() === normalizedLanguage
  )?.code;

  return baseLanguage ?? fallbackLocale;
};

export const getLanguageDirection = (language = fallbackLocale) =>
  supportedLocales.find(({ code }) => code === getSupportedLanguage(language))?.dir ?? "ltr";

export const applyDocumentLanguage = (language = fallbackLocale) => {
  const supportedLanguage = getSupportedLanguage(language);

  document.documentElement.setAttribute("lang", supportedLanguage);
  document.documentElement.setAttribute("dir", getLanguageDirection(supportedLanguage));
  localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage);
};
