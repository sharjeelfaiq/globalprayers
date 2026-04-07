import PrayerDashboard from "../features/prayers/components/PrayerDashboard";

const PrayerDashboardPage = () => {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: "100vh" }}
    >
      <PrayerDashboard />
    </div>
  );
};

export default PrayerDashboardPage;
