import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
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
  it("highlights the current prayer row without adding a status column", () => {
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

    const currentRow = container.querySelector(".current-prayer-row");

    expect(currentRow).toHaveAttribute("aria-current", "true");
    expect(currentRow).toContainElement(screen.getByText("12:21 PM"));
    expect(currentRow?.querySelector(".prayer-row-name")).toHaveClass("current-prayer-cell");
    expect(currentRow?.querySelector(".prayer-time-cell")).toHaveClass("current-prayer-cell");
    expect(screen.getByTitle("Asr")).not.toHaveClass("current-prayer-cell");
  });

  it("renders the timing badge and progress bar inside the standalone time card", () => {
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

    expect(container.querySelector(".prayer-time-card")).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Prayer progress" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show elapsed prayer time" })).toHaveTextContent(
      "Next 03:16:00"
    );
    expect(screen.queryByText("Next prayer in 3h 16m 0s")).not.toBeInTheDocument();
    expect(screen.queryByText("Next 3h 16m 0s")).not.toBeInTheDocument();
    expect(screen.queryByText("Remaining 3h 16m 0s")).not.toBeInTheDocument();
    expect(screen.getAllByText("Dhuhr")).not.toHaveLength(0);
    expect(screen.getAllByText("Asr")).not.toHaveLength(0);
    expect(screen.queryByText("Current Prayer")).not.toBeInTheDocument();
    expect(screen.queryByText("Next Prayer")).not.toBeInTheDocument();

    const progressBar = screen.getByRole("progressbar", {
      name: "Progress to next prayer",
    });

    expect(progressBar).toHaveAttribute("aria-valuenow", "4");
    expect(progressBar.querySelector(".prayer-progress-fill")).toBeInTheDocument();

    const summary = container.querySelector(".prayer-time-card");
    const statusRow = container.querySelector(".prayer-progress-status-row");
    const toggle = screen.getByRole("button", { name: "Show elapsed prayer time" });

    expect(summary).toContainElement(statusRow);
    expect(statusRow?.children).toHaveLength(1);
    expect(statusRow?.children[0]).toBe(toggle);
    expect(container.querySelector(".prayer-progress-meta")).not.toBeInTheDocument();
  });

  it("shows the live current time as the primary table header element", () => {
    const { container, rerender } = renderWithPrayerData(
      <PrayersTable currentTime={new Date(2026, 3, 1, 12, 30, 5)} />,
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

    const currentTimeDisplay = screen.getByLabelText("Current time");
    const headerRow = container.querySelector(".prayer-progress-top-row");
    const statusRow = container.querySelector(".prayer-progress-status-row");

    expect(currentTimeDisplay).toHaveClass("prayer-current-time");
    expect(currentTimeDisplay).toHaveTextContent("12:30:05 PM");
    expect(headerRow).toContainElement(currentTimeDisplay);
    expect(headerRow).toContainElement(statusRow);

    rerender(
      <PrayersContext.Provider
        value={{
          prayerTimes: [
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
          ],
          isLoading: false,
          error: "",
          today: "",
          islamicDate: "",
          lastUpdated: null,
          refreshPrayerTimes: jest.fn(),
        }}
      >
        <PrayersTable currentTime={new Date(2026, 3, 1, 12, 30, 6)} />
      </PrayersContext.Provider>
    );

    expect(screen.getByLabelText("Current time")).toHaveTextContent("12:30:06 PM");
  });

  it("marks only the next upcoming prayer row with a compact label", () => {
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

    const nextLabels = screen.getAllByText("Next");
    const nextRow = container.querySelector(".next-prayer-row");

    expect(nextLabels).toHaveLength(1);
    expect(nextLabels[0]).toHaveClass("next-prayer-label");
    expect(nextRow).toContainElement(screen.getByTitle("Asr"));
    expect(nextRow).not.toHaveAttribute("aria-current");
    expect(screen.getByTitle("Dhuhr")).not.toHaveClass("next-prayer-label");
  });

  it("toggles the single progress timing badge between next prayer and elapsed", () => {
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

    const toggle = screen.getByRole("button", { name: "Show elapsed prayer time" });

    expect(toggle).toHaveTextContent("Next 03:16:00");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("Elapsed 0h 9m 0s")).not.toBeInTheDocument();

    fireEvent.click(toggle);

    expect(screen.getByRole("button", { name: "Show next prayer time" })).toHaveTextContent(
      "Last 00:09:00"
    );
    expect(screen.getByRole("button", { name: "Show next prayer time" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.queryByText("Next 03:16:00")).not.toBeInTheDocument();
    expect(screen.queryByText("Done 00:09:00")).not.toBeInTheDocument();
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

  it("uses fluid layout hooks without horizontal scrolling fallbacks", () => {
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
    const statusRow = container.querySelector(".prayer-progress-status-row");

    expect(shell).toHaveClass("prayer-table-fluid");
    expect(shell).not.toHaveClass("prayer-table-horizontal-scroll");
    expect(statusRow).toHaveClass("prayer-progress-status-fluid");
    expect(statusRow).toHaveClass("prayer-progress-status-compact");
    expect(screen.getByRole("button", { name: "Show elapsed prayer time" })).toHaveClass(
      "prayer-progress-toggle-fluid"
    );
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

  it("keeps the table body content-tight without forcing row stretch to the shell bottom", () => {
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
    const table = screen.getByRole("table");

    expect(shell).toHaveClass("prayer-table-content-tight");
    expect(table).toHaveClass("prayer-table-content-tight");
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
