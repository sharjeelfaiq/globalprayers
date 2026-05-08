import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";
import AsmaUlHusna from "./AsmaUlHusna";
import Header from "./Header";
import PrayersTable from "./PrayersTable";

const PrayerDashboard = () => {
  const currentTime = useCurrentTime(1000);

  return (
    <main className="prayer-dashboard prayer-dashboard-full-height">
      <Header />
      <AsmaUlHusna />
      <PrayersTable currentTime={currentTime} />
    </main>
  );
};

export default PrayerDashboard;
