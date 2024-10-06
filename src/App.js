import { useEffect, useState, useCallback, useContext } from "react";
import { getData } from "./api.js";
import { PrayersContext } from "./context/prayersContext.js";
import Header from "./Header.js";
import PrayersTable from "./PrayersTable.js";
import "./App.css";

const App = () => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [today, setToday] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { settings, setSettings } = useContext(PrayersContext);

  const fetchPrayerTimes = useCallback(() => {
    getData.prayerTimes(settings).then(setPrayerTimes);
  }, [settings]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  useEffect(() => {
    if (prayerTimes) {
      const currentDate = new Date().getDate() - 1;
      const currentDayData = prayerTimes[currentDate];

      setIslamicDate(
        `${currentDayData.date.hijri.month.en} ${currentDayData.date.hijri.day}, ${currentDayData.date.hijri.year}`
      );
      setToday(currentDayData.date.readable);
    }
  }, [prayerTimes]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSettingChange = useCallback(
    (key) => (event) => {
      const value = event.target.value;
      setSettings((prev) => ({ ...prev, [key]: value }));
      localStorage.setItem(key, value);
    },
    [setSettings]
  );

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center" style={{ height: "100vh" }}>
      <Header
        today={today}
        islamicDate={islamicDate}
        handleSettingChange={handleSettingChange}
      />
      {prayerTimes && (
        <PrayersTable
          prayerTimes={prayerTimes}
          currentTime={currentTime}
        />
      )}
    </div>
  );
};

export default App;
