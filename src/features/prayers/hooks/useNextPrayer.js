import { useMemo } from "react";
import { getNextPrayer, getTimeUntilPrayer } from "../utils/prayerTimes";

export const useNextPrayer = (times = [], now = new Date()) =>
  useMemo(() => {
    const nextPrayer = getNextPrayer(times, now);
    const countdown = getTimeUntilPrayer(nextPrayer?.prayerTime, now);

    return {
      nextPrayerName: nextPrayer?.prayerName ?? "",
      nextPrayerTime: nextPrayer?.prayerTime ?? null,
      nextPrayerCountdown: countdown,
    };
  }, [now, times]);
