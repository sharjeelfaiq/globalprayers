import React, { useEffect, useState, useCallback, useMemo } from "react";
import { config } from "./config";
import { getData } from "./api.js";
import "./App.css";

const {
  default: DEFAULT_SETTINGS,
  schools,
  methods,
  lattitude_adjustment_options,
  mindnight_calculation_options,
} = config;

const App = () => {
  const [data, setData] = useState(null);
  const [timesArr, setTimesArr] = useState([]);
  const [today, setToday] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayerMinutes, setNextPrayerMinutes] = useState(null);
  const [asmaUlHusna, setAsmaUlHusna] = useState([]);
  const [settings, setSettings] = useState(() => ({
    city: localStorage.getItem("city") || DEFAULT_SETTINGS.city,
    country: localStorage.getItem("country") || DEFAULT_SETTINGS.country,
    school: localStorage.getItem("school") || DEFAULT_SETTINGS.school,
    method: localStorage.getItem("method") || DEFAULT_SETTINGS.method,
    latitudeAdjustment:
      localStorage.getItem("latitudeAdjustment") ||
      DEFAULT_SETTINGS.latitudeAdjustment,
    midnightCalculation:
      localStorage.getItem("midnightCalculation") ||
      DEFAULT_SETTINGS.midnightCalculation,
  }));

  const fetchAsmaUlHusna = useCallback(() => {
    getData.asmaUlHusma().then((data) => {
      setAsmaUlHusna(data);
    });
  }, []);

  useEffect(() => {
    fetchAsmaUlHusna();
  }, [fetchAsmaUlHusna]);

  const fetchPrayerTimes = useCallback(() => {
    getData.prayerTimes(settings).then((data) => {
      setData(data);
    });
  }, [settings]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  useEffect(() => {
    if (data) {
      const currentDate = new Date().getDate() - 1;
      const currentDayData = data[currentDate];

      setIslamicDate(
        `${currentDayData.date.hijri.month.en} ${currentDayData.date.hijri.day}, ${currentDayData.date.hijri.year}`
      );
      setToday(currentDayData.date.readable);

      const relevantTimes = Object.entries(currentDayData.timings).filter(
        (_, index) => ![4, 7, 8, 9, 10].includes(index)
      );

      setTimesArr(relevantTimes);
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateNextPrayerTime();
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesArr]);

  const handleSettingChange = useCallback(
    (key) => (event) => {
      const value = event.target.value;
      setSettings((prev) => ({ ...prev, [key]: value }));
      localStorage.setItem(key, value);
    },
    []
  );

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

  const updateNextPrayerTime = () => {
    const now = new Date();
    let nextPrayerTime = null;
    let minDiff = Infinity;

    if (timesArr)
      timesArr.forEach(([_, time]) => {
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

    if (!nextPrayerTime && timesArr?.length > 0) {
      const [, time] = timesArr[0];
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

  const isCurrentPrayer = (prayerTime, nextPrayerTime) => {
    return currentTime >= prayerTime && currentTime < nextPrayerTime;
  };

  const renderPrayerRows = () => {
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

      return (
        <tr
          key={index}
          className={
            isCurrentPrayer(prayerTime, nextPrayerTime)
              ? "current-prayer-row"
              : ""
          }
        >
          <td>{prayerName}</td>
          <td>{formattedPrayerTime}</td>
        </tr>
      );
    });
  };

  return (
    <div className="position-relative container w-100 table-responsive text-center clock-container">
      <div className="d-flex justify-content-end position-absolute top-0 end-0">
        <div className="dropdown">
          <button
            className="btn dropdown-toggle text-white mt-2"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-cog"></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <div className="dropdown-item">
                Method
                <select
                  className="form-select mt-2 text-black"
                  value={settings.method}
                  onChange={handleSettingChange("method")}
                >
                  {methods.map((method, index) => (
                    <option key={index} value={index}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </li>
            <li>
              <div className="dropdown-item">
                City
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter city name"
                  value={settings.city}
                  onChange={handleSettingChange("city")}
                />
              </div>
            </li>
            <li>
              <div className="dropdown-item">
                Country
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter country name"
                  value={settings.country}
                  onChange={handleSettingChange("country")}
                />
              </div>
            </li>
            <li>
              <div className="dropdown-item">
                Juristic School (only affects Asr calculation)
                <select
                  className="form-select mt-2 text-black"
                  value={settings.school}
                  onChange={handleSettingChange("school")}
                >
                  {schools.map((school, index) => (
                    <option key={index} value={index}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>
            </li>
            <li>
              <div className="dropdown-item">
                Higher Latitude Adjustment:
                <select
                  className="form-select mt-2 text-black"
                  value={settings.latitudeAdjustment}
                  onChange={handleSettingChange("latitudeAdjustment")}
                >
                  {lattitude_adjustment_options.map((option, index) => (
                    <option key={index} value={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </li>
            <li>
              <div className="dropdown-item">
                Midnight Calculation Mode:
                <select
                  className="form-select mt-2 text-black"
                  value={settings.midnightCalculation}
                  onChange={handleSettingChange("midnightCalculation")}
                >
                  {mindnight_calculation_options.map((option, index) => (
                    <option key={index} value={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <h5
        className="my-1 text-white mt-3 px-3 text-sm position-absolute top-0 start-0 text-start"
        style={{ fontFamily: "Roboto Mono, monospace" }}
      >
        {today}
        <br />
        {islamicDate}
      </h5>
      <p className="mt-3 text-white text-center">
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
              display: nextPrayerMinutes.hours === 0 && "none",
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
        <tbody>{renderPrayerRows()}</tbody>
      </table>
    </div>
  );
};

export default App;
