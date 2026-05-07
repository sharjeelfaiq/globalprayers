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
  it("renders prayer rows without a separate status column or highlight styling", () => {
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
    expect(screen.getByText("Asr")).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Status" })).not.toBeInTheDocument();
    expect(screen.queryByText("Current Prayer")).not.toBeInTheDocument();
    expect(screen.queryByText("Next Prayer")).not.toBeInTheDocument();
    expect(container.querySelector(".current-prayer-row")).not.toBeInTheDocument();
  });

  it("uses the compact prayer schedule table styling hook", () => {
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

    const table = screen.getByRole("table");

    expect(table).toHaveClass("prayer-table");
    expect(container.querySelector(".prayer-table-shell")).toContainElement(table);
  });

  it("keeps compact cells readable when names are visually truncated", () => {
    renderWithPrayerData(
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

    expect(screen.getByText("Maghrib")).toHaveAttribute("title", "Maghrib");
    expect(screen.getByText("06:32 PM")).toHaveClass("prayer-time-cell");
  });
});
