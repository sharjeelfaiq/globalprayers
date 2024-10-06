import axios from "axios";

const PRAYER_TIMES_URL = "https://api.aladhan.com/v1/calendarByCity";
const ASMA_UL_HUSNA_URL = "https://api.aladhan.com/v1/asmaAlHusna/:number";

const constructPrayerTimesUrl = ({
  city,
  country,
  method,
  school,
  latitudeAdjustment,
  midnightCalculation,
}) => {
  const date = new Date();
  return `${PRAYER_TIMES_URL}/${date.getFullYear()}/${
    date.getMonth() + 1
  }?city=${city}&country=${country}&method=${method}&school=${school}&latitudeAdjustment=${latitudeAdjustment}&midnightCalculation=${midnightCalculation}`;
};

export const getData = {
  asmaUlHusma: async () => {
    const randomNumber = Math.floor(Math.random() * 99) + 1;
    const url = ASMA_UL_HUSNA_URL.replace(":number", randomNumber);
    return fetchData(url);
  },

  prayerTimes: async (params) => {
    const url = constructPrayerTimesUrl(params);
    return fetchData(url);
  },
};

const fetchData = async (url) => {
  try {
    const { data } = await axios.get(url); // Destructure directly
    return data.data; // Assuming the response structure remains the same
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};
