import { useTranslation } from "react-i18next";
import { supportedLocales } from "../../i18n/config";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation("common");

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <label className="language-switcher">
      <i className="fas fa-globe" aria-hidden="true"></i>
      <select
        className="language-switcher-select"
        aria-label={t("language")}
        value={i18n.resolvedLanguage || i18n.language}
        onChange={handleLanguageChange}
      >
        {supportedLocales.map(({ code, nativeLabel }) => (
          <option key={code} value={code}>
            {nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
