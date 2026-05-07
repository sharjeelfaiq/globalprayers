import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import PrayerDashboardPage from "./PrayerDashboardPage";

jest.mock("../features/prayers/components/PrayerDashboard", () => () => (
  <div data-testid="prayer-dashboard" />
));

describe("PrayerDashboardPage", () => {
  it("uses the responsive app shell instead of a fixed viewport-height inline style", () => {
    const { container } = render(<PrayerDashboardPage />);
    const shell = container.firstElementChild;

    expect(shell).toHaveClass("app-shell");
    expect(shell).toHaveClass("container");
    expect(shell).not.toHaveStyle({ height: "100vh" });
  });
});
