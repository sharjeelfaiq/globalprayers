import { useContext, useEffect, useState } from "react";
import { PrayersContext } from "../../context/prayersContext";

const NextPrayer = () => {
  const { prayerTimes } = useContext(PrayersContext);
  const [nextPrayerMinutes, setNextPrayerMinutes] = useState(null);

  useEffect(() => {
    if (prayerTimes) {
      const currentDate = new Date().getDate() - 1;
      const currentDayData = prayerTimes[currentDate];
      const relevantTimes = Object.entries(currentDayData.timings).filter(
        (_, index) => ![4, 7, 8, 9, 10].includes(index)
      );
      updateNextPrayerTime(relevantTimes);
    }
  }, [prayerTimes]);

  const updateNextPrayerTime = (times) => {
    const now = new Date();
    let nextPrayerTime = null;
    let minDiff = Infinity;

    times.forEach(([_, time]) => {
      const [hours, minutes] = time.split(":");
      const prayerTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(hours),
        parseInt(minutes)
      );

      if (prayerTime > now) {
        const diff = (prayerTime - now) / (1000 * 60);
        if (diff < minDiff) {
          minDiff = diff;
          nextPrayerTime = prayerTime;
        }
      }
    });

    if (!nextPrayerTime && times.length > 0) {
      const [, time] = times[0];
      const [hours, minutes] = time.split(":");
      nextPrayerTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        parseInt(hours),
        parseInt(minutes)
      );
      minDiff = (nextPrayerTime - now) / (1000 * 60);
    }

    const hoursUntilNextPrayer = Math.floor(minDiff / 60);
    const minutesUntilNextPrayer = Math.round(minDiff % 60);

    setNextPrayerMinutes({
      hours: hoursUntilNextPrayer,
      minutes: minutesUntilNextPrayer,
    });
  };

  return (
    <>
      {nextPrayerMinutes && (
        <h6 className="mt-1 text-white next-prayer-time">
          Next prayer in{" "}
          <span
            style={{
              display: nextPrayerMinutes.hours === 0 ? "none" : "inline",
            }}
          >
            {nextPrayerMinutes.hours}h
          </span>{" "}
          {nextPrayerMinutes.minutes}m
        </h6>
      )}
    </>
  );
};

export default NextPrayer;
