import { useTranslation } from "react-i18next";
import { usePrayerData } from "../context/hooks";
import { usePrayerTimeline } from "../hooks/usePrayerTimeline";
import { useTodayPrayerData } from "../hooks/useTodayPrayerData";

const formatDuration = (duration, t) => {
  if (!duration) {
    return "";
  }

  return t("duration.hoursMinutes", {
    hours: duration.hours,
    minutes: duration.minutes,
  });
};

const NextPrayer = ({ currentTime }) => {
  const { t } = useTranslation("prayers");
  const { isLoading, error } = usePrayerData();
  const { relevantPrayerTimes } = useTodayPrayerData(currentTime);
  const timeline = usePrayerTimeline(relevantPrayerTimes, currentTime);

  if (isLoading) {
    return <h6 className="mt-1 text-white status-text">{t("status.loadingPrayerTimes")}</h6>;
  }

  if (error) {
    return (
      <h6 className="mt-1 text-white status-text">
        {t("status.prayerTimesUnavailable")}
      </h6>
    );
  }

  if (!timeline) {
    return null;
  }

  return (
    <section
      className="prayer-timeline-card text-white"
      aria-label={t("timeline.ariaLabel")}
      aria-live="polite"
      style={{ "--prayer-progress": `${timeline.progressPercent}%` }}
    >
      <div className="prayer-progress-labels">
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
        className="prayer-progress"
        role="progressbar"
        aria-label={t("timeline.progressAriaLabel")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={timeline.progressPercent}
      >
        <span className="prayer-progress-fill" />
      </div>
    </section>
  );
};

export default NextPrayer;
