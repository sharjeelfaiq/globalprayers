import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePrayerData } from "../context/hooks";
import { usePrayerRows } from "../hooks/usePrayerRows";
import { usePrayerTimeline } from "../hooks/usePrayerTimeline";
import { useTodayPrayerData } from "../hooks/useTodayPrayerData";

const formatDuration = (duration, t) => {
  if (!duration) {
    return "";
  }

  return t("duration.hoursMinutesSeconds", {
    hours: duration.hours,
    minutes: duration.minutes,
    seconds: duration.seconds ?? 0,
  });
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
    <div className="prayer-table-shell prayer-table-relaxed prayer-table-full-height prayer-table-content-tight">
      <table
        className="table table-borderless prayer-table prayer-table-content-tight text-white"
        aria-label={t("table.ariaLabel")}
      >
        <thead>
          {timeline ? (
            <tr className="prayer-table-progress-row">
              <th
                className="prayer-table-progress-header"
                scope="colgroup"
                colSpan="2"
                aria-label={t("timeline.progressHeaderLabel")}
              >
                <div
                  className="prayer-table-progress-summary"
                  aria-label={t("timeline.ariaLabel")}
                  aria-live="polite"
                  style={{ "--prayer-progress": `${timeline.progressPercent}%` }}
                >
                  <div className="prayer-progress-main">
                    <span>
                      <small>{t("timeline.currentPrayer")}</small>
                      <strong>{t(`names.${timeline.currentPrayerName}`)}</strong>
                    </span>
                    <p className="prayer-timeline-countdown">
                      {t("timeline.nextPrayerIn", {
                        duration: formatDuration(timeline.remaining, t),
                      })}
                    </p>
                    <span>
                      <small>{t("timeline.nextPrayer")}</small>
                      <strong>{t(`names.${timeline.nextPrayerName}`)}</strong>
                    </span>
                  </div>
                  <div
                    className="prayer-progress-meta"
                    aria-label={t("timeline.progressMetaLabel")}
                  >
                    <button
                      type="button"
                      className="prayer-progress-toggle"
                      aria-label={
                        showingElapsed
                          ? t("timeline.showRemaining")
                          : t("timeline.showElapsed")
                      }
                      aria-pressed={showingElapsed}
                      onClick={toggleTimeView}
                    >
                      {showingElapsed
                        ? t("timeline.elapsed", {
                            duration: formatDuration(timeline.elapsed, t),
                          })
                        : t("timeline.remaining", {
                            duration: formatDuration(timeline.remaining, t),
                          })}
                    </button>
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
              </th>
            </tr>
          ) : null}
        </thead>
        <tbody>
          {prayerRows.map(({ prayerName, formattedPrayerTime, isCurrent }) => {
            const translatedPrayerName = t(`names.${prayerName}`);
            const currentPrayerClass = isCurrent ? " current-prayer-cell" : "";

            return (
              <tr
                key={prayerName}
                className={isCurrent ? "current-prayer-row" : undefined}
                aria-current={isCurrent ? "true" : undefined}
              >
                <td>
                  <span
                    className={`prayer-row-name${currentPrayerClass}`}
                    title={translatedPrayerName}
                  >
                    {translatedPrayerName}
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
  );
};

export default PrayersTable;
