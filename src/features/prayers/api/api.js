import axios from "axios";
import { config } from "../config/config";

const PRAYER_TIMES_URL = "https://api.aladhan.com/v1/calendarByCity";
const ASMA_UL_HUSNA_URL = "https://api.aladhan.com/v1/asmaAlHusna/:number";

const normalizeIndexedValue = (value, options = []) => {
  if (value === undefined || value === null) {
    return value;
  }

  if (/^\d+$/.test(String(value))) {
    return String(value);
  }

  const optionIndex = options.indexOf(value);
  return optionIndex >= 0 ? String(optionIndex) : String(value);
};

const constructPrayerTimesUrl = ({
  city,
  country,
  method,
  school,
  latitudeAdjustment,
  midnightCalculation,
}) => {
  const date = new Date();
  const normalizedMethod = normalizeIndexedValue(method, config.methods);
  const normalizedSchool = normalizeIndexedValue(school, config.schools);
  const normalizedLatitudeAdjustment = normalizeIndexedValue(
    latitudeAdjustment,
    config.latitude_adjustment_options
  );
  const normalizedMidnightCalculation = normalizeIndexedValue(
    midnightCalculation,
    config.mindnight_calculation_options
  );

  return `${PRAYER_TIMES_URL}/${date.getFullYear()}/${
    date.getMonth() + 1
  }?city=${encodeURIComponent(city)}&country=${encodeURIComponent(
    country
  )}&method=${normalizedMethod}&school=${normalizedSchool}&latitudeAdjustment=${normalizedLatitudeAdjustment}&midnightCalculation=${normalizedMidnightCalculation}`;
};

const fetchData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data.data;
  } catch (error) {
    const message =
      error?.response?.data?.data ||
      error?.response?.data?.message ||
      error.message ||
      "Request failed";

    throw new Error(message);
  }
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
