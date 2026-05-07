import { useMemo } from "react";
import { buildPrayerRows } from "../utils/prayerTimes";

export const usePrayerRows = (times = [], now = new Date(), locale = "en-US") =>
  useMemo(() => buildPrayerRows(times, now, locale), [locale, now, times]);
