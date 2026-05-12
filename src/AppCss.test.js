import fs from "fs";
import path from "path";

const readAppCss = () =>
  fs.readFileSync(path.join(__dirname, "App.css"), "utf8");

const getRuleBody = (css, selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "m"));

  return match?.[1] ?? "";
};

const getRuleBodies = (css, selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return [...css.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "gm"))]
    .map((match) => match[1])
    .join("\n");
};

const getMediaRuleBody = (css, mediaQuery, selector) => {
  const escapedMediaQuery = mediaQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const mediaStart = css.search(new RegExp(`@media ${escapedMediaQuery}\\s*\\{`, "m"));

  if (mediaStart === -1) {
    return "";
  }

  const nextMediaStart = css.indexOf("\n@media", mediaStart + 1);
  const mediaBlock = css.slice(mediaStart, nextMediaStart === -1 ? undefined : nextMediaStart);

  return [...mediaBlock.matchAll(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "gm"))]
    .map((match) => match[1])
    .join("\n");
};

describe("App CSS", () => {
  it("uses the Stitch-inspired dark glass design tokens and background", () => {
    const css = readAppCss();
    const rootRule = getRuleBody(css, ":root");
    const bodyRule = getRuleBody(css, "body");

    expect(css).toContain("Playfair Display");
    expect(rootRule).toContain("--font-display: \"Playfair Display\", Georgia, serif");
    expect(rootRule).toContain("--color-accent: #55dfff");
    expect(rootRule).toContain("--color-gold: #e5c35b");
    expect(bodyRule).toContain("url(\"./Images/mosque-bg.jpg\")");
    expect(bodyRule).toContain("background-attachment: fixed");
  });

  it("keeps the header top-aligned with a prominent brand block", () => {
    const css = readAppCss();
    const appShellRule = getRuleBody(css, ".app-shell");
    const dashboardRule = getRuleBody(css, ".prayer-dashboard");
    const contentRule = getRuleBody(css, ".prayer-dashboard-content");
    const headerRule = getRuleBody(css, ".dashboard-header");
    const titleRule = getRuleBody(css, ".dashboard-title");
    const dateRule = getRuleBody(css, ".dashboard-date");

    expect(appShellRule).toContain("display: flex");
    expect(appShellRule).toContain("justify-content: flex-start");
    expect(appShellRule).toContain("align-items: center");
    expect(dashboardRule).toContain("width: min(100%, 90rem)");
    expect(dashboardRule).toContain("justify-content: flex-start");
    expect(contentRule).toContain("width: min(100%, 52.5rem)");
    expect(contentRule).toContain("align-self: center");
    expect(headerRule).toContain("align-items: flex-start");
    expect(headerRule).toContain("justify-content: space-between");
    expect(titleRule).toContain("font-family: var(--font-display)");
    expect(dateRule).toContain("letter-spacing: 0.18em");
    expect(dateRule).toContain("text-transform: uppercase");
  });

  it("separates the live time card from the prayer list card", () => {
    const css = readAppCss();
    const scheduleRule = getRuleBody(css, ".prayer-schedule");
    const timeCardRule = getRuleBody(css, ".prayer-time-card");
    const tableShellRule = getRuleBodies(css, ".prayer-table-shell");
    const sharedCardRule = getRuleBody(css, ".prayer-time-card,\n.prayer-table-shell");

    expect(scheduleRule).toContain("width: min(100%, 52.5rem)");
    expect(scheduleRule).toContain("grid-template-rows: auto minmax(0, 1fr)");
    expect(scheduleRule).toContain("gap: clamp(0.7rem, 1.7vh, 1rem)");
    expect(timeCardRule).toContain("min-height: 7.5rem");
    expect(timeCardRule).toContain("border-radius: var(--radius-lg)");
    expect(tableShellRule).toContain("width: 100%");
    expect(tableShellRule).toContain("overflow: auto");
    expect(sharedCardRule).toContain("backdrop-filter: blur(18px)");
  });

  it("lays out the current time left and countdown pill right", () => {
    const css = readAppCss();
    const topRowRule = getRuleBody(css, ".prayer-progress-top-row");
    const currentTimeRule = getRuleBody(css, ".prayer-current-time");
    const statusRowRule = getRuleBody(css, ".prayer-progress-status-row");
    const toggleRule = getRuleBody(css, ".prayer-progress-toggle");

    expect(topRowRule).toContain("grid-template-columns: minmax(0, 1fr) auto");
    expect(topRowRule).toContain("align-items: center");
    expect(currentTimeRule).toContain("justify-self: start");
    expect(currentTimeRule).toContain("font-size: clamp(2rem, 4vw, 2.65rem)");
    expect(currentTimeRule).toContain("font-variant-numeric: tabular-nums");
    expect(statusRowRule).toContain("grid-column: 2");
    expect(statusRowRule).toContain("justify-self: end");
    expect(toggleRule).toContain("border-radius: 999px");
    expect(toggleRule).toContain("color: var(--color-accent)");
    expect(toggleRule).toContain("letter-spacing: 0.2em");
    expect(toggleRule).toContain("text-transform: uppercase");
  });

  it("styles prayer rows with icons, active highlight, and compact next badge", () => {
    const css = readAppCss();
    const tableCellRules = getRuleBodies(css, ".prayer-table td");
    const iconRule = getRuleBody(css, ".prayer-row-icon");
    const nameGroupRule = getRuleBody(css, ".prayer-name-group");
    const nextLabelRule = getRuleBody(css, ".next-prayer-label");
    const currentRowRule = getRuleBody(css, ".current-prayer-row td");
    const currentIconRule = getRuleBody(css, ".current-prayer-row .prayer-row-icon,\n.current-prayer-row .prayer-time-cell");

    expect(tableCellRules).toContain("font-size: clamp(0.94rem, 1.25vw, 1.08rem)");
    expect(tableCellRules).toContain("padding: clamp(0.68rem, 1.55vh, 0.86rem) clamp(1rem, 3.4vw, 2.2rem)");
    expect(nameGroupRule).toContain("display: inline-flex");
    expect(iconRule).toContain("color: rgba(230, 236, 240, 0.42)");
    expect(nextLabelRule).toContain("background: var(--color-accent)");
    expect(nextLabelRule).toContain("border-radius: 999px");
    expect(currentRowRule).toContain("linear-gradient");
    expect(currentIconRule).toContain("color: var(--color-accent)");
  });

  it("uses one shared subtle icon button system for language and settings actions", () => {
    const css = readAppCss();
    const iconButtonRule = getRuleBody(css, ".header-icon-button");
    const iconRule = getRuleBody(css, ".header-icon-button i");
    const hoverRule = getRuleBody(css, ".header-icon-button:hover,\n.header-icon-button:focus-visible");
    const languageMenuRule = getRuleBody(css, ".language-switcher-menu");

    expect(iconButtonRule).toContain("display: inline-grid");
    expect(iconButtonRule).toContain("width: 2.45rem");
    expect(iconButtonRule).toContain("height: 2.45rem");
    expect(iconButtonRule).toContain("place-items: center");
    expect(iconButtonRule).toContain("border-radius: 999px");
    expect(iconButtonRule).toContain("backdrop-filter: blur(12px)");
    expect(iconRule).toContain("font-size: 0.95rem");
    expect(hoverRule).toContain("border-color: var(--color-accent-border)");
    expect(languageMenuRule).toContain("max-height: min(70vh, 24rem)");
    expect(languageMenuRule).toContain("overflow-y: auto");
  });

  it("renders the Asma section as a lower gold devotional block", () => {
    const css = readAppCss();
    const dailyRule = getRuleBody(css, ".daily-name");
    const arabicRule = getRuleBody(css, ".asma-arabic");
    const meaningRule = getRuleBody(css, ".asma-meaning");
    const dividerRule = getRuleBody(css, ".asma-divider");
    const quoteRule = getRuleBody(css, ".asma-quote");

    expect(dailyRule).toContain("width: min(100%, 38rem)");
    expect(dailyRule).toContain("text-align: center");
    expect(arabicRule).toContain("color: var(--color-gold)");
    expect(meaningRule).toContain("letter-spacing: 0.22em");
    expect(dividerRule).toContain("background: rgba(229, 195, 91, 0.58)");
    expect(quoteRule).toContain("font-style: italic");
  });

  it("keeps mobile and narrow viewport layouts readable", () => {
    const css = readAppCss();
    const mobileAppShellRule = getMediaRuleBody(css, "(max-width: 720px)", ".app-shell");
    const mobileBodyRule = getMediaRuleBody(css, "(max-width: 720px)", "body");
    const mobileTopRowRule = getMediaRuleBody(css, "(max-width: 720px)", ".prayer-progress-top-row");
    const mobileStatusRule = getMediaRuleBody(css, "(max-width: 720px)", ".prayer-progress-status-row");
    const mobileTableCellRule = getMediaRuleBody(css, "(max-width: 720px)", ".prayer-table td");
    const narrowTitleRule = getMediaRuleBody(css, "(max-width: 380px)", ".dashboard-title");
    const narrowCurrentTimeRule = getMediaRuleBody(css, "(max-width: 380px)", ".prayer-current-time");

    expect(mobileAppShellRule).toContain("padding: clamp(0.62rem, 2.4vh, 0.9rem) clamp(0.72rem, 4vw, 1rem) clamp(0.62rem, 2.4vh, 0.9rem)");
    expect(mobileBodyRule).toContain("background-attachment: scroll");
    expect(mobileTopRowRule).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(mobileStatusRule).toContain("justify-self: stretch");
    expect(mobileTableCellRule).toContain("font-size: 0.88rem");
    expect(narrowTitleRule).toContain("font-size: 1.55rem");
    expect(narrowCurrentTimeRule).toContain("font-size: 1.55rem");
  });

  it("avoids common responsive overflow traps in the dashboard CSS", () => {
    const css = readAppCss();
    const tableRowRule = getRuleBody(css, ".prayer-table tbody tr");
    const nextLabelRule = getRuleBody(css, ".next-prayer-label");
    const languageMenuRule = getRuleBody(css, ".language-switcher-menu");
    const titleRule = getRuleBody(css, ".dashboard-title");
    const nameGroupRule = getRuleBody(css, ".prayer-name-group");

    expect(css).not.toMatch(/width:\s*100vw/);
    expect(css).not.toMatch(/margin-inline-start:\s*-/);
    expect(tableRowRule).not.toMatch(/\bheight:\s*\d/);
    expect(nextLabelRule).toContain("flex: 0 0 auto");
    expect(languageMenuRule).toContain("max-width: calc(100vw - 1.5rem)");
    expect(titleRule).toContain("overflow-wrap: anywhere");
    expect(nameGroupRule).toContain("min-width: 0");
  });

  it("keeps the dashboard bounded to the viewport with compact first-fold spacing", () => {
    const css = readAppCss();
    const bodyRule = getRuleBody(css, "body");
    const rootRule = getRuleBody(css, "#root");
    const appShellRule = getRuleBody(css, ".app-shell");
    const dashboardRule = getRuleBody(css, ".prayer-dashboard");
    const contentRule = getRuleBody(css, ".prayer-dashboard-content");
    const timeCardRule = getRuleBody(css, ".prayer-time-card");
    const tableShellRule = getRuleBodies(css, ".prayer-table-shell");
    const tableCellRules = getRuleBodies(css, ".prayer-table td");
    const compactHeightShellRule = getMediaRuleBody(
      css,
      "(max-height: 720px) and (min-width: 721px)",
      ".app-shell"
    );
    const compactHeightContentRule = getMediaRuleBody(
      css,
      "(max-height: 720px) and (min-width: 721px)",
      ".prayer-dashboard-content"
    );

    expect(bodyRule).toContain("height: 100dvh");
    expect(bodyRule).toContain("overflow-y: hidden");
    expect(rootRule).toContain("height: 100dvh");
    expect(appShellRule).toContain("height: 100dvh");
    expect(appShellRule).toContain("overflow-y: hidden");
    expect(appShellRule).toContain("padding: clamp(0.75rem, 2vh, 1.35rem) clamp(1rem, 5vw, 5rem) clamp(0.9rem, 2.4vh, 1.55rem)");
    expect(dashboardRule).toContain("height: 100%");
    expect(dashboardRule).toContain("overflow: hidden");
    expect(contentRule).toContain("flex: 1 1 auto");
    expect(contentRule).toContain("justify-content: space-between");
    expect(contentRule).toContain("gap: clamp(0.85rem, 2.2vh, 1.45rem)");
    expect(contentRule).toContain("margin-top: clamp(0.95rem, 2.7vh, 1.85rem)");
    expect(timeCardRule).toContain("min-height: 7.5rem");
    expect(tableShellRule).toContain("overflow: auto");
    expect(tableCellRules).toContain("padding: clamp(0.68rem, 1.55vh, 0.86rem) clamp(1rem, 3.4vw, 2.2rem)");
    expect(compactHeightShellRule).toContain("padding-bottom: 0.82rem");
    expect(compactHeightContentRule).toContain("gap: 0.9rem");
    expect(compactHeightContentRule).toContain("margin-top: 0.9rem");
  });
});
