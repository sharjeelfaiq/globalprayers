import { useMemo } from "react";
import { buildPrayerRows } from "../utils/prayerTimes";

export const usePrayerRows = (times = [], now = new Date()) =>
  useMemo(() => buildPrayerRows(times, now), [now, times]);
