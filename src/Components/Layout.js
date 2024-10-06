import PrayersTable from "./PrayersTable";
import NextPrayer from "./NextPrayer";
import Clock from "./Clock";
import AsmaUlHusna from "./AsmaUlHusna";
import Header from "../Header";
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
