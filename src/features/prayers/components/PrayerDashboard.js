import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";
import AsmaUlHusna from "./AsmaUlHusna";
import Clock from "./Clock";
import Header from "./Header";
import PrayersTable from "./PrayersTable";

const PrayerDashboard = () => {
  const currentMinute = useCurrentTime(60000);

  return (
    <>
      <Header />
      <AsmaUlHusna />
      <Clock />
      <PrayersTable currentTime={currentMinute} />
    </>
  );
};

export default PrayerDashboard;
