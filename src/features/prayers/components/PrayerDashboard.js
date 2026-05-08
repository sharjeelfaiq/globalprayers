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
        <AsmaUlHusna />
        <PrayersTable currentTime={currentTime} />
      </main>
    </div>
  );
};

export default PrayerDashboard;
