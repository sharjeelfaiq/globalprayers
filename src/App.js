import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./App.css";

const API_BASE_URL = "https://api.aladhan.com/v1/calendarByCity";
const DEFAULT_SETTINGS = {
  country: "Pakistan",
  city: "Quetta",
  method: "1",
  school: "0",
};

const CITY_NAMES = [
  "Quetta",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Multan",
  "Faisalabad",
  "Gujarat",
  "Rawalpindi",
  "Peshawar",
  "Bahawalpur",
];

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

const App = () => {
  const [data, setData] = useState(null);
  const [timesArr, setTimesArr] = useState([]);
  const [today, setToday] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayerMinutes, setNextPrayerMinutes] = useState(null);

  const [settings, setSettings] = useState(() => ({
    city: localStorage.getItem("city") || DEFAULT_SETTINGS.city,
    school: localStorage.getItem("school") || DEFAULT_SETTINGS.school,
    method: localStorage.getItem("method") || DEFAULT_SETTINGS.method,
  }));

  const fetchPrayerTimes = useCallback(async () => {
    const date = new Date();
    const { city, method, school } = settings;
    const url = `${API_BASE_URL}/${date.getFullYear()}/${
      date.getMonth() + 1
    }?city=${city}&country=${
      DEFAULT_SETTINGS.country
    }&method=${method}&school=${school}`;

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

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }, [currentTime]);

  const updateNextPrayerTime = () => {
    const now = new Date();
    let nextPrayerTime = null;
    let minDiff = Infinity;

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

    if (!nextPrayerTime) {
      // If no prayer time is found for today, check the first prayer of tomorrow
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

    // Calculate hours and minutes for display
    const hoursUntilNextPrayer = Math.floor(minDiff / 60);
    const minutesUntilNextPrayer = Math.round(minDiff % 60);

    setNextPrayerMinutes({
      hours: hoursUntilNextPrayer,
      minutes: minutesUntilNextPrayer,
    });
  };

  return (
    <>
      <div className="container w-100 table-responsive text-center clock-container">
        <h1 className="my-2 text-white">
          {settings.city.charAt(0).toUpperCase() + settings.city.slice(1)}{" "}
          Prayer Timings&nbsp;
          <span style={{ fontStyle: "italic", fontSize: "20px" }}>
            ({today})
          </span>
        </h1>
        <h2 className="my-2 text-white">{islamicDate}</h2>
        <h3 className="my-2 text-white">{formattedTime}</h3>
        {nextPrayerMinutes && (
          <h5 className="my-2">
            Next prayer in {nextPrayerMinutes.hours} hours and{" "}
            {nextPrayerMinutes.minutes} minutes
          </h5>
        )}
        <div className="dropdown-container">
          <select
            className="form-select"
            value={settings.city}
            onChange={handleSettingChange("city")}
          >
            {CITY_NAMES.map((city, index) => (
              <option key={index} value={city} className="text-black">
                {city}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={settings.method}
            onChange={handleSettingChange("method")}
          >
            {METHODS.map((method, index) => (
              <option key={index} value={index + 1} className="text-black">
                {method}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={settings.school}
            onChange={handleSettingChange("school")}
          >
            {SCHOOLS.map((school, index) => (
              <option key={index} value={index} className="text-black">
                {school}
              </option>
            ))}
          </select>
        </div>
        <table className="table table-hover table-dark table-shadow">
          <thead>
            <tr>
              <th>Prayer</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {timesArr.map(([prayer, time], index) => {
              // Remove '(PKT)' and split the time into hour and minute
              const cleanTime = time.replace(/ \(PKT\)/, "").trim();
              const [hour, minute] = cleanTime.split(":");

              const hourIn12 = hour % 12 || 12; // Convert to 12-hour format
              const amPm = hour < 12 ? "AM" : "PM"; // Determine AM or PM

              const formattedTime = `${hourIn12}:${String(minute).padStart(
                2,
                "0"
              )} ${amPm}`; // Format to hh:mm AM/PM

              return (
                <tr key={index}>
                  <td>{prayer.replace(/_/g, " ")}</td>
                  <td>{formattedTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default App;
