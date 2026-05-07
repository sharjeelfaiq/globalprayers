import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../shared/components/LanguageSwitcher";
import { usePrayerData, usePrayerMeta, usePrayerSettings } from "../context/hooks";

const Header = () => {
  const { t } = useTranslation(["common", "prayers"]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsButtonRef = useRef(null);
  const settingsModalRef = useRef(null);
  const { error } = usePrayerData();
  const { today, islamicDate } = usePrayerMeta();
  const {
    handleSettingChange,
    settings: {
      method,
      city,
      country,
      school,
      latitudeAdjustment,
      midnightCalculation,
    },
    methods,
    schools,
    latitude_adjustment_options,
    mindnight_calculation_options,
  } = usePrayerSettings();

  const formClass = "settings-control";
  const settingsTitleId = "settings-modal-title";
  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
    window.requestAnimationFrame(() => settingsButtonRef.current?.focus());
  }, []);

  const handleSettingsKeyDown = useCallback((event) => {
    if (event.key === "Escape") {
      closeSettings();
      return;
    }

    if (event.key !== "Tab" || !settingsModalRef.current) {
      return;
    }

    const focusableElements = settingsModalRef.current.querySelectorAll(
      'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }, [closeSettings]);

  useEffect(() => {
    if (!isSettingsOpen) {
      return undefined;
    }

    const firstControl = settingsModalRef.current?.querySelector("select, input, button");
    firstControl?.focus();

    document.addEventListener("keydown", handleSettingsKeyDown);

    return () => {
      document.removeEventListener("keydown", handleSettingsKeyDown);
    };
  }, [handleSettingsKeyDown, isSettingsOpen]);

  return (
    <div className="dashboard-header d-flex justify-content-between container-fluid">
      <h6 className="dashboard-date text-white text-start">
        {error ? t("dateUnavailable") : today || t("loadingDate")}
        <br />
        {error ? t("hijriDateUnavailable") : islamicDate || t("loadingHijriDate")}
      </h6>

      <div className="header-actions">
        <LanguageSwitcher />
        <button
          ref={settingsButtonRef}
          className="btn text-white"
          type="button"
          aria-expanded={isSettingsOpen}
          aria-haspopup="dialog"
          aria-label={t("settings.ariaLabel", { ns: "prayers" })}
          onClick={() => setIsSettingsOpen(true)}
        >
          <i className="fas fa-cog"></i>
        </button>

        {isSettingsOpen ? (
          <div
            className="settings-modal-backdrop"
            data-testid="settings-modal-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeSettings();
              }
            }}
          >
            <div
              ref={settingsModalRef}
              className="settings-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={settingsTitleId}
            >
              <div className="settings-modal-header">
                <h2 id={settingsTitleId}>{t("settings.title", { ns: "prayers" })}</h2>
                <button
                  className="settings-modal-close"
                  type="button"
                  aria-label={t("settings.closeLabel", { ns: "prayers" })}
                  onClick={closeSettings}
                >
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>
              </div>

              <div className="settings-modal-body">
                <div className="settings-field">
                  <label className="settings-label" htmlFor="prayer-method">
                    {t("settings.method", { ns: "prayers" })}
                  </label>
                  <select
                    id="prayer-method"
                    className={formClass}
                    value={method}
                    onChange={handleSettingChange("method")}
                  >
                    {methods.map((methodLabel, index) => (
                      <option key={methodLabel} value={index}>
                        {methodLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="settings-field">
                  <label className="settings-label" htmlFor="prayer-city">
                    {t("settings.city", { ns: "prayers" })}
                  </label>
                  <input
                    id="prayer-city"
                    type="text"
                    className={formClass}
                    placeholder={t("settings.cityPlaceholder", { ns: "prayers" })}
                    value={city}
                    onChange={handleSettingChange("city")}
                  />
                </div>

                <div className="settings-field">
                  <label className="settings-label" htmlFor="prayer-country">
                    {t("settings.country", { ns: "prayers" })}
                  </label>
                  <input
                    id="prayer-country"
                    type="text"
                    className={formClass}
                    placeholder={t("settings.countryPlaceholder", { ns: "prayers" })}
                    value={country}
                    onChange={handleSettingChange("country")}
                  />
                </div>

                <div className="settings-field">
                  <label className="settings-label" htmlFor="prayer-school">
                    {t("settings.school", { ns: "prayers" })}
                  </label>
                  <select
                    id="prayer-school"
                    className={formClass}
                    value={school}
                    onChange={handleSettingChange("school")}
                  >
                    {schools.map((schoolLabel, index) => (
                      <option key={schoolLabel} value={index}>
                        {schoolLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="settings-field">
                  <label className="settings-label" htmlFor="prayer-latitude-adjustment">
                    {t("settings.latitudeAdjustment", { ns: "prayers" })}
                  </label>
                  <select
                    id="prayer-latitude-adjustment"
                    className={formClass}
                    value={latitudeAdjustment}
                    onChange={handleSettingChange("latitudeAdjustment")}
                  >
                    {latitude_adjustment_options.map((option, index) => (
                      <option key={option} value={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="settings-field">
                  <label className="settings-label" htmlFor="prayer-midnight-calculation">
                    {t("settings.midnightCalculation", { ns: "prayers" })}
                  </label>
                  <select
                    id="prayer-midnight-calculation"
                    className={formClass}
                    value={midnightCalculation}
                    onChange={handleSettingChange("midnightCalculation")}
                  >
                    {mindnight_calculation_options.map((option, index) => (
                      <option key={option} value={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
