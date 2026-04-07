import { useMemo } from "react";
import { usePrayerData, usePrayerMeta } from "../context/hooks";
import {
  formatIslamicDate,
  formatReadableDate,
  getCurrentDayData,
  getRelevantPrayerTimes,
} from "../utils/prayerTimes";

export const useTodayPrayerData = (now = new Date()) => {
  const { prayerTimes, isLoading, error } = usePrayerData();
  const { lastUpdated } = usePrayerMeta();

  return useMemo(() => {
    const currentDayData = getCurrentDayData(prayerTimes, now);
    const relevantPrayerTimes = getRelevantPrayerTimes(currentDayData?.timings);

    return {
      currentDayData,
      relevantPrayerTimes,
      today: formatReadableDate(currentDayData),
      islamicDate: formatIslamicDate(currentDayData),
      isLoading,
      error,
      lastUpdated,
    };
  }, [error, isLoading, lastUpdated, now, prayerTimes]);
};
