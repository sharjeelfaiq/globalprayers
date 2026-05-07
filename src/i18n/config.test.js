import {
  LANGUAGE_STORAGE_KEY,
  applyDocumentLanguage,
  getLanguageDirection,
  supportedLocales,
} from "./config";

describe("i18n config", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
  });

  it("defines the supported launch locales with direction metadata", () => {
    expect(supportedLocales.map(({ code }) => code)).toEqual(["en", "ar", "ur"]);
    expect(getLanguageDirection("en")).toBe("ltr");
    expect(getLanguageDirection("ar")).toBe("rtl");
    expect(getLanguageDirection("ur")).toBe("rtl");
    expect(getLanguageDirection("fr")).toBe("ltr");
  });

  it("applies persisted language metadata to the html element", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "ur");

    applyDocumentLanguage("ur");

    expect(document.documentElement).toHaveAttribute("lang", "ur");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("ur");
  });
});
