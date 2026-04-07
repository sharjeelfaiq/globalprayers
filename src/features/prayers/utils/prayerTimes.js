const DISPLAY_PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const getCurrentDayIndex = (now = new Date()) => now.getDate() - 1;

export const getCurrentDayData = (prayerTimes, now = new Date()) => {
  if (!Array.isArray(prayerTimes) || prayerTimes.length === 0) {
    return null;
  }

  return prayerTimes[getCurrentDayIndex(now)] ?? null;
};

export const getRelevantPrayerTimes = (timings = {}) =>
  DISPLAY_PRAYERS.flatMap((prayerName) =>
    timings[prayerName] ? [[prayerName, timings[prayerName]]] : []
  );

export const createPrayerDate = (time, now = new Date(), dayOffset = 0) => {
  if (!time) {
    return null;
  }

  const [hours = "0", minutes = "0"] = time.split(":");

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + dayOffset,
    Number.parseInt(hours, 10),
    Number.parseInt(minutes, 10)
  );
};

export const formatPrayerTime = (time, now = new Date(), locale = "en-US") => {
  const prayerDate = createPrayerDate(time, now);

  if (!prayerDate) {
    return "";
  }

  return prayerDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getNextPrayer = (times = [], now = new Date()) => {
  if (!times.length) {
    return null;
  }

  for (const [prayerName, time] of times) {
    const prayerTime = createPrayerDate(time, now);

    if (prayerTime > now) {
      return { prayerName, prayerTime };
    }
  }

  const [prayerName, time] = times[0];
  return {
    prayerName,
    prayerTime: createPrayerDate(time, now, 1),
  };
};

export const getTimeUntilPrayer = (prayerTime, now = new Date()) => {
  if (!prayerTime) {
    return null;
  }

  const differenceInMinutes = Math.max(0, (prayerTime - now) / (1000 * 60));

  return {
    hours: Math.floor(differenceInMinutes / 60),
    minutes: Math.round(differenceInMinutes % 60),
  };
};

export const isCurrentPrayerWindow = (prayerTime, nextPrayerTime, now = new Date()) =>
  Boolean(prayerTime && nextPrayerTime && now >= prayerTime && now < nextPrayerTime);

export const buildPrayerRows = (times = [], now = new Date()) =>
  times.map(([prayerName, time], index) => {
    const prayerTime = createPrayerDate(time, now);
    const nextTime = times[index + 1]?.[1];
    const nextPrayerTime = nextTime
      ? createPrayerDate(nextTime, now)
      : createPrayerDate(times[0]?.[1], now, 1);

    return {
      prayerName,
      formattedPrayerTime: formatPrayerTime(time, now),
      isCurrent: isCurrentPrayerWindow(prayerTime, nextPrayerTime, now),
    };
  });

export const formatIslamicDate = (currentDayData) => {
  if (!currentDayData?.date?.hijri) {
    return "";
  }

  const { month, day, year } = currentDayData.date.hijri;
  return `${month.en} ${day}, ${year}`;
};

export const formatReadableDate = (currentDayData) =>
  currentDayData?.date?.readable ?? "";
