import { usePrayerData } from "../context/hooks";
import { usePrayerTimeline } from "../hooks/usePrayerTimeline";
import { useTodayPrayerData } from "../hooks/useTodayPrayerData";

const formatDuration = (duration) => {
  if (!duration) {
    return "";
  }

  return `${duration.hours}h ${duration.minutes}m`;
};

const NextPrayer = ({ currentTime }) => {
  const { isLoading, error } = usePrayerData();
  const { relevantPrayerTimes } = useTodayPrayerData(currentTime);
  const timeline = usePrayerTimeline(relevantPrayerTimes, currentTime);

  if (isLoading) {
    return <h6 className="mt-1 text-white status-text">Loading prayer times...</h6>;
  }

  if (error) {
    return (
      <h6 className="mt-1 text-white status-text">
        Prayer times are unavailable right now.
      </h6>
    );
  }

  if (!timeline) {
    return null;
  }

  return (
    <section
      className="prayer-timeline-card text-white"
      aria-label="Prayer timeline"
      aria-live="polite"
      style={{ "--prayer-progress": `${timeline.progressPercent}%` }}
    >
      <div className="prayer-timeline-row">
        <strong className="prayer-timeline-name">{timeline.previousPrayerName}</strong>
        <div className="prayer-timeline-countdown">
          Next prayer is in {formatDuration(timeline.remaining)}
        </div>
        <div className="prayer-timeline-next">
          <span>Next Prayer</span>
          <strong className="prayer-timeline-name prayer-timeline-name-next">
            {timeline.nextPrayerName}
          </strong>
        </div>
      </div>

      <div
        className="prayer-progress"
        role="progressbar"
        aria-label={`Progress from ${timeline.previousPrayerName} to ${timeline.nextPrayerName}`}
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
