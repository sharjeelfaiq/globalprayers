// prayersContext.js
import { useState, createContext } from "react";
import { config } from "../config";

const {
  default: DEFAULT_SETTINGS,
  schools,
  methods,
  latitude_adjustment_options,
  mindnight_calculation_options,
} = config;

export const PrayersContext = createContext();

export const PrayersProvider = ({ children }) => {
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

  const values = {
    settings,
    setSettings,
    schools,
    methods,
    latitude_adjustment_options,
    mindnight_calculation_options,
  };

  return (
    <PrayersContext.Provider value={values}>
      {children}
    </PrayersContext.Provider>
  );
};
