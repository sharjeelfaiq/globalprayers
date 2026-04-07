import { usePrayerData } from "../context/hooks";
import { useNextPrayer } from "../hooks/useNextPrayer";
import { useTodayPrayerData } from "../hooks/useTodayPrayerData";

const NextPrayer = ({ currentTime }) => {
  const { isLoading, error } = usePrayerData();
  const { relevantPrayerTimes } = useTodayPrayerData(currentTime);
  const { nextPrayerCountdown } = useNextPrayer(relevantPrayerTimes, currentTime);

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

  if (!nextPrayerCountdown) {
    return null;
  }

  return (
    <h6 className="mt-1 text-white next-prayer-time">
      Next prayer in{" "}
      <span
        style={{
          display: nextPrayerCountdown.hours === 0 ? "none" : "inline",
        }}
      >
        {nextPrayerCountdown.hours}h
      </span>{" "}
      {nextPrayerCountdown.minutes}m
    </h6>
  );
};

export default NextPrayer;
