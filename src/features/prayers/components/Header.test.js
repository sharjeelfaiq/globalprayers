import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import Header from "./Header";
import { PrayersContext } from "../context/PrayersContext";
import i18n from "../../../i18n";
import { LANGUAGE_STORAGE_KEY } from "../../../i18n/config";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

const contextValue = {
  error: "",
  today: "07 Apr 2026",
  islamicDate: "Shawwal 19, 1447",
  settings: {
    method: "1",
    city: "Rawalpindi",
    country: "Pakistan",
    school: "0",
    latitudeAdjustment: "Middle of the Night Method",
    midnightCalculation: "Standard (Mid Sunset to Sunrise)",
  },
  methods: ["University of Islamic Sciences, Karachi"],
  schools: ["Shafi", "Hanafi"],
  latitude_adjustment_options: ["Middle of the Night Method"],
  mindnight_calculation_options: ["Standard (Mid Sunset to Sunrise)"],
  handleSettingChange: jest.fn(() => () => {}),
};

describe("Header", () => {
  beforeEach(() => {
    contextValue.handleSettingChange.mockClear();
    contextValue.handleSettingChange.mockImplementation(() => jest.fn());
    i18n.changeLanguage("en");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("dir", "ltr");
  });

  it("renders a language switcher beside prayer settings and persists RTL language selection", () => {
    render(
      <PrayersContext.Provider value={contextValue}>
        <Header />
      </PrayersContext.Provider>
    );

    expect(screen.getByRole("button", { name: "Prayer settings" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Language"), {
      target: { value: "ur" },
    });

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("ur");
    expect(document.documentElement).toHaveAttribute("lang", "ur");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
  });

  it("opens and closes the prayer settings modal", () => {
    render(
      <PrayersContext.Provider value={contextValue}>
        <Header />
      </PrayersContext.Provider>
    );

    expect(screen.queryByRole("dialog", { name: "Prayer Settings" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Prayer settings" }));

    const modal = screen.getByRole("dialog", { name: "Prayer Settings" });
    expect(within(modal).getByLabelText("Method")).toBeInTheDocument();
    expect(within(modal).getByLabelText("City")).toHaveValue("Rawalpindi");
    expect(contextValue.handleSettingChange).toHaveBeenCalledWith("method");

    fireEvent.click(within(modal).getByRole("button", { name: "Close prayer settings" }));

    expect(screen.queryByRole("dialog", { name: "Prayer Settings" })).not.toBeInTheDocument();
  });

  it("closes the prayer settings modal with Escape and backdrop click", async () => {
    render(
      <PrayersContext.Provider value={contextValue}>
        <Header />
      </PrayersContext.Provider>
    );

    const settingsButton = screen.getByRole("button", { name: "Prayer settings" });
    fireEvent.click(settingsButton);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Prayer Settings" })).not.toBeInTheDocument();
    await waitFor(() => expect(settingsButton).toHaveFocus());

    fireEvent.click(settingsButton);
    fireEvent.click(screen.getByTestId("settings-modal-backdrop"));

    expect(screen.queryByRole("dialog", { name: "Prayer Settings" })).not.toBeInTheDocument();
  });
});
