import { useTranslation } from "react-i18next";
import { usePrayerData } from "../context/hooks";
import { usePrayerRows } from "../hooks/usePrayerRows";
import { useTodayPrayerData } from "../hooks/useTodayPrayerData";

const PrayersTable = ({ currentTime }) => {
  const { i18n, t } = useTranslation("prayers");
  const { isLoading, error, locale } = usePrayerData();
  const { relevantPrayerTimes } = useTodayPrayerData(currentTime);
  const activeLocale = locale || i18n.resolvedLanguage || i18n.language;
  const prayerRows = usePrayerRows(relevantPrayerTimes, currentTime, activeLocale);

  if (isLoading) {
    return <p className="text-white status-text mt-3">{t("status.loadingSchedule")}</p>;
  }

  if (error) {
    return (
      <p className="text-white status-text mt-3">
        {t("status.scheduleUnavailable")}
      </p>
    );
  }

  if (!prayerRows.length) {
    return <p className="text-white status-text mt-3">{t("status.noSchedule")}</p>;
  }

  return (
    <div className="prayer-table-shell">
      <table className="table table-borderless prayer-table text-white">
        <thead>
          <tr>
            <th scope="col">{t("table.prayer")}</th>
            <th scope="col">{t("table.time")}</th>
          </tr>
        </thead>
        <tbody>
          {prayerRows.map(({ prayerName, formattedPrayerTime }) => {
            const translatedPrayerName = t(`names.${prayerName}`);

            return (
              <tr key={prayerName}>
                <td>
                  <span className="prayer-row-name" title={translatedPrayerName}>
                    {translatedPrayerName}
                  </span>
                </td>
                <td className="prayer-time-cell">{formattedPrayerTime}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PrayersTable;
