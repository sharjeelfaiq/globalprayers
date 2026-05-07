import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import NextPrayer from "./NextPrayer";
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

describe("NextPrayer", () => {
  it("renders elapsed and remaining prayer timeline details", () => {
    renderWithPrayerData(
      <NextPrayer currentTime={new Date(2026, 3, 1, 12, 30)} />,
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

    expect(screen.queryByText("Current prayer window")).not.toBeInTheDocument();
    expect(screen.getByText("Next Prayer")).toBeInTheDocument();
    expect(screen.getByText("Dhuhr")).toBeInTheDocument();
    expect(screen.getByText("Asr")).toBeInTheDocument();
    expect(screen.getByText("Next prayer is in 3h 16m")).toBeInTheDocument();
    expect(screen.queryByText("Elapsed 0h 9m")).not.toBeInTheDocument();
    expect(screen.queryByText("Remaining 3h 16m")).not.toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");

    expect(progressBar).toHaveAttribute("aria-valuenow", "4");
    expect(progressBar.querySelector(".prayer-progress-fill")).toBeInTheDocument();
  });
});
