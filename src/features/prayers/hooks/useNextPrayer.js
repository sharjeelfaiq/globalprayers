import { useMemo } from "react";
import { getPrayerTimelineState } from "../utils/prayerTimes";

export const useNextPrayer = (times = [], now = new Date()) =>
  useMemo(() => {
    const timeline = getPrayerTimelineState(times, now);

    return {
      nextPrayerName: timeline?.nextPrayerName ?? "",
      nextPrayerTime: timeline?.nextPrayerTime ?? null,
      nextPrayerCountdown: timeline?.remaining ?? null,
    };
  }, [now, times]);
