import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { getData } from "../api/api";
import { config } from "../config/config";
import {
  formatIslamicDate,
  formatReadableDate,
  getCurrentDayData,
} from "../utils/prayerTimes";

const {
  default: DEFAULT_SETTINGS,
  schools,
  methods,
  latitude_adjustment_options,
  mindnight_calculation_options,
} = config;

const SETTINGS_STORAGE_KEY = "prayerSettings";

const getStoredSettings = () => {
  const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!storedSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
  } catch (error) {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    return DEFAULT_SETTINGS;
  }
};

export const PrayersContext = createContext(null);

export const PrayersProvider = ({ children }) => {
  const { i18n, t } = useTranslation("prayers");
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [settings, setSettings] = useState(getStoredSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleSettingChange = useCallback(
    (key) => (event) => {
      const value = event.target.value;

      setSettings((prev) => {
        const newSettings = { ...prev, [key]: value };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
        return newSettings;
      });
    },
    []
  );

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getData.prayerTimes(settings);
      setPrayerTimes(data);
      setLastUpdated(new Date().toISOString());
    } catch (fetchError) {
      setPrayerTimes(null);
      setError(fetchError.message);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  const locale = i18n.resolvedLanguage || i18n.language;
  const currentDayData = useMemo(() => getCurrentDayData(prayerTimes), [prayerTimes]);
  const today = useMemo(
    () => formatReadableDate(currentDayData, locale),
    [currentDayData, locale]
  );
  const islamicDate = useMemo(
    () =>
      formatIslamicDate(currentDayData, (monthName) =>
        t(`dates.hijriMonths.${monthName}`, { defaultValue: monthName })
      ),
    [currentDayData, t]
  );

  const values = useMemo(
    () => ({
      currentDayData,
      locale,
      settings,
      setSettings,
      schools,
      methods,
      latitude_adjustment_options,
      mindnight_calculation_options,
      prayerTimes,
      today,
      islamicDate,
      isLoading,
      error,
      lastUpdated,
      refreshPrayerTimes: fetchPrayerTimes,
      handleSettingChange,
    }),
    [
      currentDayData,
      error,
      fetchPrayerTimes,
      handleSettingChange,
      islamicDate,
      isLoading,
      lastUpdated,
      locale,
      prayerTimes,
      settings,
      today,
    ]
  );

  return (
    <PrayersContext.Provider value={values}>{children}</PrayersContext.Provider>
  );
};
