import {
  buildPrayerRows,
  formatPrayerTime,
  getCurrentDayData,
  getNextPrayer,
  getRelevantPrayerTimes,
  getTimeUntilPrayer,
  isCurrentPrayerWindow,
} from "./prayerTimes";

describe("prayerTimes utilities", () => {
  const prayerTimes = [
    {
      date: {
        readable: "06 Apr 2026",
        hijri: {
          day: "18",
          year: "1447",
          month: { en: "Shawwal" },
        },
      },
      timings: {
        Fajr: "05:00",
        Sunrise: "06:15",
        Dhuhr: "12:20",
        Asr: "15:45",
        Sunset: "18:30",
        Maghrib: "18:31",
        Isha: "19:45",
        Imsak: "04:50",
        Midnight: "00:05",
        Firstthird: "22:00",
        Lastthird: "02:00",
      },
    },
    {
      date: {
        readable: "07 Apr 2026",
        hijri: {
          day: "19",
          year: "1447",
          month: { en: "Shawwal" },
        },
      },
      timings: {
        Fajr: "05:01",
        Sunrise: "06:16",
        Dhuhr: "12:21",
        Asr: "15:46",
        Sunset: "18:31",
        Maghrib: "18:32",
        Isha: "19:46",
        Imsak: "04:51",
        Midnight: "00:06",
        Firstthird: "22:01",
        Lastthird: "02:01",
      },
    },
  ];

  it("selects the current day from the monthly prayer data", () => {
    const now = new Date(2026, 3, 2, 10, 0);

    expect(getCurrentDayData(prayerTimes, now)).toEqual(prayerTimes[1]);
  });

  it("filters timings down to the supported prayer list in the expected order", () => {
    const result = getRelevantPrayerTimes(prayerTimes[1].timings);

    expect(result).toEqual([
      ["Fajr", "05:01"],
      ["Sunrise", "06:16"],
      ["Dhuhr", "12:21"],
      ["Asr", "15:46"],
      ["Maghrib", "18:32"],
      ["Isha", "19:46"],
    ]);
  });

  it("finds the next prayer for the current day", () => {
    const now = new Date(2026, 3, 7, 12, 30);
    const result = getNextPrayer(getRelevantPrayerTimes(prayerTimes[1].timings), now);

    expect(result.prayerName).toBe("Asr");
    expect(result.prayerTime).toEqual(new Date(2026, 3, 7, 15, 46));
  });

  it("rolls the next prayer to the following day when the day is complete", () => {
    const now = new Date(2026, 3, 7, 23, 30);
    const result = getNextPrayer(getRelevantPrayerTimes(prayerTimes[1].timings), now);

    expect(result.prayerName).toBe("Fajr");
    expect(result.prayerTime).toEqual(new Date(2026, 3, 8, 5, 1));
  });

  it("reports the active prayer window correctly", () => {
    const now = new Date(2026, 3, 7, 12, 30);
    const prayerTime = new Date(2026, 3, 7, 12, 21);
    const nextPrayerTime = new Date(2026, 3, 7, 15, 46);

    expect(isCurrentPrayerWindow(prayerTime, nextPrayerTime, now)).toBe(true);
  });

  it("builds display rows with current prayer state", () => {
    const now = new Date(2026, 3, 7, 12, 30);
    const result = buildPrayerRows(getRelevantPrayerTimes(prayerTimes[1].timings), now);

    expect(result.find((row) => row.prayerName === "Dhuhr")?.isCurrent).toBe(true);
    expect(result.find((row) => row.prayerName === "Asr")?.isCurrent).toBe(false);
  });

  it("formats prayer times for display", () => {
    const now = new Date(2026, 3, 7, 12, 30);

    expect(formatPrayerTime("05:01", now)).toBe("05:01 AM");
  });

  it("calculates the countdown to the next prayer", () => {
    const prayerTime = new Date(2026, 3, 7, 15, 46);
    const now = new Date(2026, 3, 7, 12, 30);

    expect(getTimeUntilPrayer(prayerTime, now)).toEqual({
      hours: 3,
      minutes: 16,
    });
  });
});
