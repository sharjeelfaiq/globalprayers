import { useContext, useEffect, useMemo, useState } from "react";
import { PrayersContext } from "../../context/prayersContext";

const PrayersTable = () => {
  const [timesArr, setTimesArr] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { prayerTimes } = useContext(PrayersContext);

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
        (_, index) => ![4, 7, 8, 9, 10].includes(index)
      );
      setTimesArr(relevantTimes);
    }
  }, [prayerTimes]);

  const isCurrentPrayer = (prayerTime, nextPrayerTime) =>
    currentTime >= prayerTime && currentTime < nextPrayerTime;
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
  return (
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
  );
};

export default PrayersTable;
