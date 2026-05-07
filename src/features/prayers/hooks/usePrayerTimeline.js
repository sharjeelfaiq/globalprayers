import { useMemo } from "react";
import { getPrayerTimelineState } from "../utils/prayerTimes";

export const usePrayerTimeline = (times = [], now = new Date()) =>
  useMemo(() => getPrayerTimelineState(times, now), [now, times]);
