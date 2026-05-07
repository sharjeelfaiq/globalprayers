import { useContext } from "react";
import { PrayersContext } from "./PrayersContext";

export const usePrayersContext = () => {
  const context = useContext(PrayersContext);

  if (!context) {
    throw new Error("usePrayersContext must be used within PrayersProvider");
  }

  return context;
};

export const usePrayerSettings = () => {
  const {
    settings,
    setSettings,
    handleSettingChange,
    methods,
    schools,
    latitude_adjustment_options,
    mindnight_calculation_options,
  } = usePrayersContext();

  return {
    settings,
    setSettings,
    handleSettingChange,
    methods,
    schools,
    latitude_adjustment_options,
    mindnight_calculation_options,
  };
};

export const usePrayerData = () => {
  const { currentDayData, locale, prayerTimes, isLoading, error, refreshPrayerTimes } =
    usePrayersContext();

  return {
    currentDayData,
    locale,
    prayerTimes,
    isLoading,
    error,
    refreshPrayerTimes,
  };
};

export const usePrayerMeta = () => {
  const { today, islamicDate, lastUpdated } = usePrayersContext();

  return {
    today,
    islamicDate,
    lastUpdated,
  };
};
