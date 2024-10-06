import PrayersTable from "./PrayersTable/PrayersTable";
import NextPrayer from "./NextPrayer/NextPrayer";
import Clock from "./Clock/Clock";
import AsmaUlHusna from "./AsmaUlHusna/AsmaUlHusna";
import Header from "./Header/Header";
const Layout = () => {
  return (
    <>
      <Header />
      <AsmaUlHusna />
      <Clock />
      <NextPrayer />
      <PrayersTable />
    </>
  );
};

export default Layout;
