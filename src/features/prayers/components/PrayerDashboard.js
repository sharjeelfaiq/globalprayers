import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";
import AsmaUlHusna from "./AsmaUlHusna";
import Header from "./Header";
import PrayersTable from "./PrayersTable";

const PrayerDashboard = () => {
  const currentTime = useCurrentTime(1000);

  return (
    <div className="prayer-dashboard">
      <Header />
      <main className="prayer-dashboard-content">
        <PrayersTable currentTime={currentTime} />
        <AsmaUlHusna />
      </main>
    </div>
  );
};

export default PrayerDashboard;
