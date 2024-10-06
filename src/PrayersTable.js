import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PrayersContext } from "./context/prayersContext";
import { getData } from "./api";

const PrayersTable = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [timesArr, setTimesArr] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayerMinutes, setNextPrayerMinutes] = useState(null);
  const [asmaUlHusna, setAsmaUlHusna] = useState([]);

  const { settings } = useContext(PrayersContext);

  const fetchPrayerTimes = useCallback(async () => {
    const data = await getData.prayerTimes(settings);
    setPrayerTimes(data);
  }, [settings]);

  const fetchAsmaUlHusna = useCallback(async () => {
    const data = await getData.asmaUlHusma();
    setAsmaUlHusna(data);
  }, []);

  useEffect(() => {
    fetchPrayerTimes();
    fetchAsmaUlHusna();
  }, [fetchPrayerTimes, fetchAsmaUlHusna]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      const currentDate = new Date().getDate() - 1;
      const currentDayData = prayerTimes[currentDate];
      const relevantTimes = Object.entries(currentDayData.timings).filter(
        (_, index) => ![4, 7, 8, 9, 10].includes(index) // Filter out unwanted times
      );
      setTimesArr(relevantTimes);
      updateNextPrayerTime(relevantTimes); // Call here after timesArr is set
    }
  }, [prayerTimes]);

  const isCurrentPrayer = (prayerTime, nextPrayerTime) =>
    currentTime >= prayerTime && currentTime < nextPrayerTime;

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
        const diff = (prayerTime - now) / (1000 * 60); // in minutes
        if (diff < minDiff) {
          minDiff = diff;
          nextPrayerTime = prayerTime;
        }
      }
    });

    // Handle case where no upcoming prayer is found
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

  const prayerRows = useMemo(() => {
    return timesArr.map(([prayerName, time], index) => {
      const [hours, minutes] = time.split(":");
      const prayerTime = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth(),
        currentTime.getDate(),
        parseInt(hours),
        parseInt(minutes)
      );

      const formattedPrayerTime = prayerTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const nextPrayerTime =
        index < timesArr.length - 1
          ? new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate(),
              parseInt(timesArr[index + 1][1].split(":")[0]),
              parseInt(timesArr[index + 1][1].split(":")[1])
            )
          : new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate() + 1,
              parseInt(timesArr[0][1].split(":")[0]),
              parseInt(timesArr[0][1].split(":")[1])
            );

      return {
        prayerName,
        formattedPrayerTime,
        isCurrent: isCurrentPrayer(prayerTime, nextPrayerTime),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesArr, currentTime]);

  const formattedTime = useMemo(
    () =>
      currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    [currentTime]
  );

  return (
    <>
      <p className="text-white text-center">
        {asmaUlHusna.map((item) => (
          <span key={item.name}>
            <strong>{item.name}:</strong> <small>{item.en.meaning}</small>
          </span>
        ))}
      </p>

      <h3 className="text-white">{formattedTime}</h3>
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
      <table className="table table-borderless table-hover text-white mt-3">
        <thead>
          <tr>
            <th scope="col">Prayer</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {prayerRows.map(
            ({ prayerName, formattedPrayerTime, isCurrent }, index) => (
              <tr key={index} className={isCurrent ? "current-prayer-row" : ""}>
                <td>{prayerName}</td>
                <td>{formattedPrayerTime}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default PrayersTable;
