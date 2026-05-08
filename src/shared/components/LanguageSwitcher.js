import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { supportedLocales } from "../../i18n/config";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div className="language-switcher">
      <button
        ref={triggerRef}
        className="language-switcher-trigger"
        type="button"
        aria-label={t("language")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
      >
        <i className="fas fa-globe" aria-hidden="true"></i>
      </button>

      {isOpen ? (
        <div className="language-switcher-menu" role="listbox" aria-label={t("language")}>
          {supportedLocales.map(({ code, nativeLabel }) => (
            <button
              key={code}
              className="language-switcher-option"
              type="button"
              role="option"
              aria-selected={(i18n.resolvedLanguage || i18n.language) === code}
              onClick={() => handleLanguageChange(code)}
            >
              {nativeLabel}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LanguageSwitcher;
