import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./App.css";

const API_BASE_URL = "https://api.aladhan.com/v1/calendarByCity";
const DEFAULT_SETTINGS = {
  country: "Pakistan",
  city: "Quetta",
  method: "1",
  school: "0",
  latitudeAdjustment: "0", // New Default Setting
  midnightCalculation: "0", // New Default Setting
};

// Existing Schools and Methods arrays
const SCHOOLS = ["Shafi", "Hanafi"];
const METHODS = [
  "Shia Ithna-Ansari",
  "University of Islamic Sciences, Karachi",
  "Islamic Society of North America",
  "Muslim World League",
  "Umm al-Qura University, Makkah",
  "Egyptian General Authority of Survey",
  "Institute of Geophysics, University of Tehran",
  "Gulf Region",
  "Kuwait",
  "Qatar",
  "Majlis Ugama Islam Singapura, Singapore",
  "Union Organization islamic de France",
  "Diyanet İşleri Başkanlığı, Turkey",
  "Spiritual Administration of Muslims of Russia",
  "Ministry of Awqaf and Islamic Affairs, Kuwait",
  "Ministry of Religious Affairs and Wakfs, Algeria",
  "Ministry of Religious Affairs, Tunisia",
  "Ministry of Endowments and Islamic Affairs, Qatar",
];

// New options for Higher Latitude Adjustment and Midnight Calculation
const LATITUDE_ADJUSTMENT_OPTIONS = [
  "Middle of the Night Method",
  "One Seventh Rule",
  "Angle Based Method",
];

const MIDNIGHT_CALCULATION_OPTIONS = [
  "Standard (Mid Sunset to Sunrise)",
  "Jafari (Mid Sunset to Fajr)",
];

const App = () => {
  const [data, setData] = useState(null);
  const [timesArr, setTimesArr] = useState([]);
  const [today, setToday] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayerMinutes, setNextPrayerMinutes] = useState(null);

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

  const fetchPrayerTimes = useCallback(async () => {
    const date = new Date();
    const {
      city,
      country,
      method,
      school,
      latitudeAdjustment,
      midnightCalculation,
    } = settings;
    const url = `${API_BASE_URL}/${date.getFullYear()}/${
      date.getMonth() + 1
    }?city=${city}&country=${country}&method=${method}&school=${school}&latitudeAdjustment=${latitudeAdjustment}&midnightCalculation=${midnightCalculation}`;

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
    }
  }, [settings]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  useEffect(() => {
    if (data?.data) {
      const currentDate = new Date().getDate() - 1;
      const currentDayData = data.data[currentDate];

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

    timesArr?.forEach(([_, time]) => {
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

    if (!nextPrayerTime) {
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

      // Format time to 12-hour clock format
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
            className="btn dropdown-toggle text-white"
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
                  {METHODS.map((method, index) => (
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
                  {SCHOOLS.map((school, index) => (
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
                  {LATITUDE_ADJUSTMENT_OPTIONS.map((option, index) => (
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
                  {MIDNIGHT_CALCULATION_OPTIONS.map((option, index) => (
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
      <h2
        className="my-1 text-white mt-3 px-3 position-absolute top-0 start-0"
        style={{ fontFamily: "Roboto Mono, monospace" }}
      >
        {today}
      </h2>
      <h2 className="my-3 text-white">{islamicDate}</h2>
      <h3 className="my-1 text-white">{formattedTime}</h3>
      {nextPrayerMinutes && (
        <h5 className="mt-1 text-white next-prayer-time">
          Next prayer in{" "}
          <span
            style={{
              display: nextPrayerMinutes.hours === 0 && "none",
            }}
          >
            {nextPrayerMinutes.hours}h
          </span>{" "}
          {nextPrayerMinutes.minutes}m
        </h5>
      )}
      <table className="table table-borderless table-hover text-white">
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
