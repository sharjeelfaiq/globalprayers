import { useContext, useEffect, useState } from "react";
import { PrayersContext } from "../../context/prayersContext";

const NextPrayer = () => {
  const { prayerTimes } = useContext(PrayersContext);
  const [nextPrayerTime, setNextPrayerTime] = useState(null);
  const [nextPrayerMinutes, setNextPrayerMinutes] = useState({ hours: 0, minutes: 0 });

  // Calculate the next prayer time when prayerTimes are available
  useEffect(() => {
    if (prayerTimes) {
      const currentDate = new Date().getDate() - 1;
      const currentDayData = prayerTimes[currentDate];
      const relevantTimes = Object.entries(currentDayData.timings).filter(
        (_, index) => ![4, 7, 8, 9, 10].includes(index)
      );
      calculateNextPrayerTime(relevantTimes);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prayerTimes]);

  // Calculate and update the next prayer time
  const calculateNextPrayerTime = (times) => {
    const now = new Date();
    let nextPrayer = null;
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
        const diff = (prayerTime - now) / (1000 * 60); // Get time difference in minutes
        if (diff < minDiff) {
          minDiff = diff;
          nextPrayer = prayerTime;
        }
      }
    });

    // Handle case when the next prayer is the first one of the next day
    if (!nextPrayer && times.length > 0) {
      const [, time] = times[0];
      const [hours, minutes] = time.split(":");
      nextPrayer = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        parseInt(hours),
        parseInt(minutes)
      );
      minDiff = (nextPrayer - now) / (1000 * 60); // Update minDiff for the next day's prayer
    }

    setNextPrayerTime(nextPrayer);
    updateNextPrayerMinutes(minDiff);
  };

  // Update the hours and minutes until the next prayer
  const updateNextPrayerMinutes = (minDiff) => {
    const hoursUntilNextPrayer = Math.floor(minDiff / 60);
    const minutesUntilNextPrayer = Math.round(minDiff % 60);

    setNextPrayerMinutes({
      hours: hoursUntilNextPrayer,
      minutes: minutesUntilNextPrayer,
    });
  };

  // Re-run the next prayer time calculation every minute to keep it accurate
  useEffect(() => {
    if (nextPrayerTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const timeDifference = (nextPrayerTime - now) / (1000 * 60); // Difference in minutes
        updateNextPrayerMinutes(timeDifference);
      }, 60000); // Update every minute

      return () => clearInterval(timer); // Clear interval on component unmount
    }
  }, [nextPrayerTime]);

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
