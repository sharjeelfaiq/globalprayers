import { useState, createContext, useCallback, useEffect, useMemo } from "react";
import { config } from "../Components/config";
import { getData } from "../api/api";

const {
  default: DEFAULT_SETTINGS,
  schools,
  methods,
  latitude_adjustment_options,
  mindnight_calculation_options,
} = config;

export const PrayersContext = createContext();

export const PrayersProvider = ({ children }) => {
  const getStoredSettings = () => {
    const storedSettings = localStorage.getItem("prayerSettings");
    return storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
  };

  const [prayerTimes, setPrayerTimes] = useState(null);
  const [settings, setSettings] = useState(getStoredSettings);

  const handleSettingChange = useCallback(
    (key) => (event) => {
      const value = event.target.value;
      setSettings((prev) => {
        const newSettings = { ...prev, [key]: value };
        localStorage.setItem("prayerSettings", JSON.stringify(newSettings));
        return newSettings;
      });
    },
    []
  );

  const fetchPrayerTimes = useCallback(async () => {
    const data = await getData.prayerTimes(settings);
    setPrayerTimes(data);
  }, [settings]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  const currentDayData = useMemo(() => {
    if (!prayerTimes) return null;
    const currentDate = new Date().getDate() - 1;
    return prayerTimes[currentDate];
  }, [prayerTimes]);

  const islamicDate = useMemo(() => {
    if (!currentDayData) return "";
    return `${currentDayData.date.hijri.month.en} ${currentDayData.date.hijri.day}, ${currentDayData.date.hijri.year}`;
  }, [currentDayData]);

  const today = useMemo(() => {
    if (!currentDayData) return "";
    return currentDayData.date.readable;
  }, [currentDayData]);

  const values = useMemo(
    () => ({
      settings,
      setSettings,
      schools,
      methods,
      latitude_adjustment_options,
      mindnight_calculation_options,
      prayerTimes,
      today,
      islamicDate,
      handleSettingChange,
    }),
    [settings, prayerTimes, today, islamicDate, handleSettingChange]
  );

  return (
    <PrayersContext.Provider value={values}>
      {children}
    </PrayersContext.Provider>
  );
};
