import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PrayerDashboard from "./PrayerDashboard";
import { useCurrentTime } from "../../../shared/hooks/useCurrentTime";

jest.mock("../../../shared/hooks/useCurrentTime", () => ({
  useCurrentTime: jest.fn(),
}));

jest.mock("./Header", () => () => <div data-testid="header" />);
jest.mock("./AsmaUlHusna", () => () => <div data-testid="asma" />);
jest.mock("./Clock", () => () => <div data-testid="clock" />);
jest.mock("./PrayersTable", () => ({ currentTime }) => (
  <div data-testid="prayers-table">{currentTime.toISOString()}</div>
));
jest.mock("./NextPrayer", () => () => <div data-testid="next-prayer-card" />);

describe("PrayerDashboard", () => {
  beforeEach(() => {
    useCurrentTime.mockReturnValue(new Date(2026, 3, 1, 12, 30));
  });

  it("renders the prayer table without the standalone next prayer card", () => {
    const { container } = render(<PrayerDashboard />);

    expect(screen.getByTestId("prayers-table")).toBeInTheDocument();
    expect(useCurrentTime).toHaveBeenCalledWith(1000);
    expect(screen.queryByTestId("next-prayer-card")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("prayer-dashboard");
    expect(container.firstElementChild).toHaveClass("prayer-dashboard-full-height");
  });
});
