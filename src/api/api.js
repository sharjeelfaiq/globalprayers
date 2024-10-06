const PRAYER_TIMES_URL = "https://api.aladhan.com/v1/calendarByCity";
const ASMA_UL_HUSNA_URL = "https://api.aladhan.com/v1/asmaAlHusna/:number";

export const getData = {
  asmaUlHusma: async () => {
    const randomNumber = Math.floor(Math.random() * 99) + 1;
    const url = ASMA_UL_HUSNA_URL.replace(":number", randomNumber);
    return await fetchData(url);
  },
  prayerTimes: async ({
    city,
    country,
    method,
    school,
    latitudeAdjustment,
    midnightCalculation,
  }) => {
    const date = new Date();
    const url = `${PRAYER_TIMES_URL}/${date.getFullYear()}/${
      date.getMonth() + 1
    }?city=${city}&country=${country}&method=${method}&school=${school}&latitudeAdjustment=${latitudeAdjustment}&midnightCalculation=${midnightCalculation}`;

    return await fetchData(url);
  },
};

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
}
