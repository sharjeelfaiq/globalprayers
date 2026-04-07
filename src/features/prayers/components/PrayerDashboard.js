import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";
import AsmaUlHusna from "./AsmaUlHusna";
import Clock from "./Clock";
import Header from "./Header";
import NextPrayer from "./NextPrayer";
import PrayersTable from "./PrayersTable";

const PrayerDashboard = () => {
  const currentMinute = useCurrentTime(60000);

  return (
    <>
      <Header />
      <AsmaUlHusna />
      <Clock />
      <NextPrayer currentTime={currentMinute} />
      <PrayersTable currentTime={currentMinute} />
    </>
  );
};

export default PrayerDashboard;
