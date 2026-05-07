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

    expect(screen.getAllByText("Dhuhr")).not.toHaveLength(0);
    expect(screen.getAllByText("Asr")).not.toHaveLength(0);
    expect(screen.queryByRole("columnheader", { name: "Status" })).not.toBeInTheDocument();
    expect(container.querySelector(".current-prayer-row")).not.toBeInTheDocument();
  });

  it("renders the next prayer progress summary inside the table header", () => {
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

    expect(screen.getByRole("columnheader", { name: "Prayer progress" })).toBeInTheDocument();
    expect(screen.getByText("Next prayer in 3h 16m")).toBeInTheDocument();
    expect(screen.getByText("Elapsed 0h 9m")).toBeInTheDocument();
    expect(screen.getByText("Remaining 3h 16m")).toBeInTheDocument();
    expect(screen.getAllByText("Dhuhr")).not.toHaveLength(0);
    expect(screen.getAllByText("Asr")).not.toHaveLength(0);

    const progressBar = screen.getByRole("progressbar", {
      name: "Progress to next prayer",
    });

    expect(progressBar).toHaveAttribute("aria-valuenow", "4");
    expect(progressBar.querySelector(".prayer-progress-fill")).toBeInTheDocument();

    const summary = container.querySelector(".prayer-table-progress-summary");
    const mainRow = container.querySelector(".prayer-progress-main");
    const metaRow = container.querySelector(".prayer-progress-meta");

    expect(summary).toContainElement(mainRow);
    expect(summary).toContainElement(metaRow);
    expect(mainRow).not.toContainElement(metaRow);
    expect(mainRow?.children).toHaveLength(3);
  });

  it("does not render visible Prayer and Time column headers", () => {
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

    expect(screen.queryByRole("columnheader", { name: "Prayer" })).not.toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Time" })).not.toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Prayer schedule" })).toBeInTheDocument();
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

  it("uses the relaxed table density styling hook", () => {
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

    expect(container.querySelector(".prayer-table-shell")).toHaveClass("prayer-table-relaxed");
  });

  it("uses the full-height table shell without an internal vertical scroll hook", () => {
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

    const shell = container.querySelector(".prayer-table-shell");

    expect(shell).toHaveClass("prayer-table-full-height");
    expect(shell).not.toHaveClass("prayer-table-scrollable");
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
