import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PrayersTable from "./PrayersTable";
import { PrayersContext } from "../context/PrayersContext";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

const renderWithPrayerData = (ui, prayerTimes) =>
  render(
    <PrayersContext.Provider
      value={{
        prayerTimes,
        isLoading: false,
        error: "",
        today: "",
        islamicDate: "",
        lastUpdated: null,
        refreshPrayerTimes: jest.fn(),
      }}
    >
      {ui}
    </PrayersContext.Provider>
  );

describe("PrayersTable", () => {
  it("does not visually highlight the current prayer row", () => {
    const { container } = renderWithPrayerData(
      <PrayersTable currentTime={new Date(2026, 3, 1, 12, 30)} />,
      [
        {
          timings: {
            Fajr: "05:01",
            Sunrise: "06:16",
            Dhuhr: "12:21",
            Asr: "15:46",
            Maghrib: "18:32",
            Isha: "19:46",
          },
        },
      ]
    );

    expect(screen.getByText("Dhuhr")).toBeInTheDocument();
    expect(container.querySelector(".current-prayer-row")).not.toBeInTheDocument();
  });
});
