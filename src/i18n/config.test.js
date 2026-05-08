import {
  LANGUAGE_STORAGE_KEY,
  applyDocumentLanguage,
  getSupportedLanguage,
  getLanguageDirection,
  supportedLocales,
} from "./config";
import { resources } from "./resources";

const expectedLocaleCodes = [
  "en",
  "ar",
  "ur",
  "id",
  "tr",
  "fa",
  "ms",
  "bn",
  "hi",
  "fr",
  "sw",
  "ps",
  "pa",
  "de",
  "es",
  "ru",
  "zh-CN",
  "zh-TW",
  "so",
  "nl",
];

const flattenKeys = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, nestedValue]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return nestedValue && typeof nestedValue === "object"
      ? flattenKeys(nestedValue, path)
      : path;
  });

describe("i18n config", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
  });

  it("defines 20 supported global Muslim-community locales with direction metadata", () => {
    expect(supportedLocales).toHaveLength(20);
    expect(supportedLocales.map(({ code }) => code)).toEqual(expectedLocaleCodes);
    expect(getLanguageDirection("en")).toBe("ltr");
    expect(getLanguageDirection("ar")).toBe("rtl");
    expect(getLanguageDirection("ur")).toBe("rtl");
    expect(getLanguageDirection("fa")).toBe("rtl");
    expect(getLanguageDirection("ps")).toBe("rtl");
    expect(getLanguageDirection("pa")).toBe("rtl");
    expect(getLanguageDirection("fr")).toBe("ltr");
  });

  it("normalizes exact regional locales before falling back to base languages", () => {
    expect(getSupportedLanguage("en-US")).toBe("en");
    expect(getSupportedLanguage("zh-CN")).toBe("zh-CN");
    expect(getSupportedLanguage("zh-cn")).toBe("zh-CN");
    expect(getSupportedLanguage("zh-TW")).toBe("zh-TW");
    expect(getSupportedLanguage("pt-BR")).toBe("en");
  });

  it("provides complete resource bundles for every supported locale", () => {
    const englishKeys = flattenKeys(resources.en).sort();

    expect(Object.keys(resources).sort()).toEqual([...expectedLocaleCodes].sort());

    supportedLocales.forEach(({ code }) => {
      expect(flattenKeys(resources[code]).sort()).toEqual(englishKeys);
      expect(resources[code].common.language).toEqual(expect.any(String));
      expect(resources[code].prayers.settings.title).toEqual(expect.any(String));
      expect(resources[code].prayers.timeline.nextIndicator).toEqual(expect.any(String));
    });
  });

  it("applies persisted language metadata to the html element", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "ur");

    applyDocumentLanguage("ur");

    expect(document.documentElement).toHaveAttribute("lang", "ur");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("ur");
  });
});
