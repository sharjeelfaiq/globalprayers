import { usePrayerData } from "../context/hooks";
import { usePrayerRows } from "../hooks/usePrayerRows";
import { useTodayPrayerData } from "../hooks/useTodayPrayerData";

const PrayersTable = ({ currentTime }) => {
  const { isLoading, error } = usePrayerData();
  const { relevantPrayerTimes } = useTodayPrayerData(currentTime);
  const prayerRows = usePrayerRows(relevantPrayerTimes, currentTime);

  if (isLoading) {
    return <p className="text-white status-text mt-3">Loading prayer schedule...</p>;
  }

  if (error) {
    return (
      <p className="text-white status-text mt-3">
        Unable to load prayer times for the selected location.
      </p>
    );
  }

  if (!prayerRows.length) {
    return <p className="text-white status-text mt-3">No prayer times available.</p>;
  }

  return (
    <table className="table table-borderless table-hover text-white mt-3">
      <thead>
        <tr>
          <th scope="col">Prayer</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>
        {prayerRows.map(({ prayerName, formattedPrayerTime }) => (
          <tr key={prayerName}>
            <td>{prayerName}</td>
            <td>{formattedPrayerTime}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PrayersTable;
