import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePrayerData } from "../context/hooks";
import { usePrayerRows } from "../hooks/usePrayerRows";
import { usePrayerTimeline } from "../hooks/usePrayerTimeline";
import { useTodayPrayerData } from "../hooks/useTodayPrayerData";

const padTimeUnit = (value = 0) => String(value).padStart(2, "0");

const formatDuration = (duration) => {
  if (!duration) {
    return "";
  }

  return [
    padTimeUnit(duration.hours),
    padTimeUnit(duration.minutes),
    padTimeUnit(duration.seconds ?? 0),
  ].join(":");
};

const formatCurrentTime = (currentTime, locale = "en-US") =>
  currentTime.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

const prayerIcons = {
  Fajr: "fa-cloud-sun",
  Sunrise: "fa-sun",
  Dhuhr: "fa-sun",
  Asr: "fa-sun",
  Maghrib: "fa-cloud-moon",
  Isha: "fa-moon",
};

const PrayersTable = ({ currentTime }) => {
  const { i18n, t } = useTranslation("prayers");
  const [timeView, setTimeView] = useState("remaining");
  const { isLoading, error, locale } = usePrayerData();
  const { relevantPrayerTimes } = useTodayPrayerData(currentTime);
  const activeLocale = locale || i18n.resolvedLanguage || i18n.language;
  const prayerRows = usePrayerRows(relevantPrayerTimes, currentTime, activeLocale);
  const timeline = usePrayerTimeline(relevantPrayerTimes, currentTime);
  const showingElapsed = timeView === "elapsed";
  const toggleTimeView = () => {
    setTimeView((currentView) =>
      currentView === "remaining" ? "elapsed" : "remaining"
    );
  };

  if (isLoading) {
    return <p className="text-white status-text mt-3">{t("status.loadingSchedule")}</p>;
  }

  if (error) {
    return (
      <p className="text-white status-text mt-3">
        {t("status.scheduleUnavailable")}
      </p>
    );
  }

  if (!prayerRows.length) {
    return <p className="text-white status-text mt-3">{t("status.noSchedule")}</p>;
  }

  return (
    <section className="prayer-schedule" aria-label={t("table.ariaLabel")}>
      {timeline ? (
        <div
          className="prayer-time-card"
          aria-label={t("timeline.ariaLabel")}
          aria-live="polite"
          style={{ "--prayer-progress": `${timeline.progressPercent}%` }}
        >
          <div className="prayer-progress-top-row">
            <div className="prayer-current-time-block">
              <span className="prayer-card-kicker">{t("timeline.currentTimeLabel")}</span>
              <time
                className="prayer-current-time"
                dateTime={currentTime.toISOString()}
                aria-label={t("timeline.currentTimeLabel")}
              >
                {formatCurrentTime(currentTime, activeLocale)}
              </time>
            </div>
            <div className="prayer-progress-status-row prayer-progress-status-fluid prayer-progress-status-compact">
              <button
                type="button"
                className="prayer-progress-toggle prayer-progress-toggle-fluid"
                aria-label={
                  showingElapsed
                    ? t("timeline.showRemaining")
                    : t("timeline.showElapsed")
                }
                aria-pressed={showingElapsed}
                onClick={toggleTimeView}
              >
                {showingElapsed
                  ? t("timeline.compactElapsed", {
                      duration: formatDuration(timeline.elapsed),
                    })
                  : t("timeline.compactNextPrayerIn", {
                      duration: formatDuration(timeline.remaining),
                    })}
              </button>
            </div>
          </div>
          <div
            className="prayer-progress"
            role="progressbar"
            aria-label={t("timeline.progressAriaLabel")}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={timeline.progressPercent}
          >
            <span className="prayer-progress-fill" />
          </div>
        </div>
      ) : null}

      <div className="prayer-table-shell prayer-table-fluid prayer-table-relaxed prayer-table-full-height prayer-table-content-tight">
        <table
          className="table table-borderless prayer-table prayer-table-content-tight text-white"
          aria-label={t("table.ariaLabel")}
        >
          <tbody>
            {prayerRows.map(({ prayerName, formattedPrayerTime, isCurrent, isNext }) => {
              const translatedPrayerName = t(`names.${prayerName}`);
              const currentPrayerClass = isCurrent ? " current-prayer-cell" : "";
              const rowClasses = [
                isCurrent ? "current-prayer-row" : "",
                isNext ? "next-prayer-row" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <tr
                  key={prayerName}
                  className={rowClasses || undefined}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  <td>
                    <span className="prayer-name-group">
                      <span className="prayer-row-icon" aria-hidden="true">
                        <i className={`fas ${prayerIcons[prayerName] || "fa-circle"}`}></i>
                      </span>
                      <span
                        className={`prayer-row-name${currentPrayerClass}`}
                        title={translatedPrayerName}
                      >
                        {translatedPrayerName}
                      </span>
                      {isNext ? (
                        <span className="next-prayer-label">{t("timeline.nextIndicator")}</span>
                      ) : null}
                    </span>
                  </td>
                  <td className={`prayer-time-cell${currentPrayerClass}`}>
                    {formattedPrayerTime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PrayersTable;
