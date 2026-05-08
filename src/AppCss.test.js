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

describe("App CSS", () => {
  it("keeps the header top-aligned and separates the main content below it", () => {
    const css = readAppCss();
    const appShellRule = getRuleBody(css, ".app-shell");
    const dashboardRule = getRuleBody(css, ".prayer-dashboard");
    const contentRule = getRuleBody(css, ".prayer-dashboard-content");
    const headerRule = getRuleBody(css, ".dashboard-header");
    const dateRule = getRuleBody(css, ".dashboard-date");
    const mobileBlock = css.match(/@media \(max-width: 480px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    const narrowBlock = css.match(/@media \(max-width: 360px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

    expect(appShellRule).toContain("display: flex");
    expect(appShellRule).toContain("justify-content: flex-start");
    expect(appShellRule).not.toContain("justify-content: safe center");
    expect(appShellRule).toContain("align-items: center");
    expect(appShellRule).toContain("overflow-y: auto");
    expect(dashboardRule).toContain("justify-content: flex-start");
    expect(headerRule).toContain("justify-content: space-between");
    expect(dateRule).toContain("justify-items: start");
    expect(dateRule).toContain("text-align: start");
    expect(contentRule).toContain("display: flex");
    expect(contentRule).toContain("align-items: center");
    expect(contentRule).toContain("margin-top: clamp");
    expect(mobileBlock).not.toContain("justify-content: flex-start");
    expect(narrowBlock).not.toContain("flex-basis: 100%");
  });

  it("keeps the prayer table compact while increasing body readability", () => {
    const css = readAppCss();
    const tableShellRule = getRuleBody(css, ".prayer-table-shell");
    const tableCellRules = getRuleBodies(css, ".prayer-table td");

    expect(tableShellRule).toContain("width: min(100%, 28rem)");
    expect(tableCellRules).toContain(
      "padding: clamp(0.5rem, 1.8vw, 0.7rem) clamp(0.46rem, 2vw, 0.78rem)"
    );
    expect(tableCellRules).toContain("font-size: 0.98rem");
    expect(tableCellRules).toContain("line-height: 1.42");
  });

  it("lays out the prayer table header with current time left and badge right", () => {
    const css = readAppCss();
    const topRowRule = getRuleBody(css, ".prayer-progress-top-row");
    const currentTimeRule = getRuleBody(css, ".prayer-current-time");
    const statusRowRule = getRuleBody(css, ".prayer-progress-status-row");
    const toggleRule = getRuleBody(css, ".prayer-progress-toggle");

    expect(topRowRule).toContain("grid-template-columns: minmax(0, 1fr) auto");
    expect(topRowRule).toContain("align-items: center");
    expect(currentTimeRule).toContain("grid-column: 1");
    expect(currentTimeRule).toContain("justify-self: start");
    expect(currentTimeRule).toContain("text-align: start");
    expect(currentTimeRule).toContain("font-size: clamp(1.08rem, 4vw, 1.45rem)");
    expect(currentTimeRule).toContain("font-variant-numeric: tabular-nums");
    expect(statusRowRule).toContain("grid-column: 2");
    expect(statusRowRule).toContain("justify-self: end");
    expect(toggleRule).toContain("min-height: 1.4rem");
    expect(toggleRule).toContain("padding: 0.2rem clamp(0.36rem, 1.5vw, 0.5rem)");
    expect(toggleRule).toContain("background-color: rgba(4, 18, 26, 0.72)");
    expect(toggleRule).toContain("color: #f4fbff");
    expect(toggleRule).toContain("font-size: 0.68rem");
    expect(toggleRule).toContain("font-weight: 700");
    expect(toggleRule).toContain("border-radius: var(--radius-sm)");
    expect(toggleRule).toContain("letter-spacing: 0.02em");
    expect(toggleRule).toContain("font-variant-numeric: tabular-nums");
    expect(toggleRule).toContain("white-space: nowrap");
  });

  it("uses one shared header icon button system for language and settings actions", () => {
    const css = readAppCss();
    const iconButtonRule = getRuleBody(css, ".header-icon-button");
    const iconRule = getRuleBody(css, ".header-icon-button i");
    const hoverRule = getRuleBody(css, ".header-icon-button:hover, .header-icon-button:focus-visible");
    const languageRule = getRuleBody(css, ".language-switcher-trigger");

    expect(iconButtonRule).toContain("display: inline-grid");
    expect(iconButtonRule).toContain("width: 2.25rem");
    expect(iconButtonRule).toContain("height: 2.25rem");
    expect(iconButtonRule).toContain("place-items: center");
    expect(iconButtonRule).toContain("border: 1px solid var(--color-border)");
    expect(iconButtonRule).toContain("border-radius: var(--radius-sm)");
    expect(iconButtonRule).toContain("background: var(--color-surface)");
    expect(iconButtonRule).toContain("color: var(--color-text)");
    expect(iconButtonRule).toContain("padding: 0");
    expect(iconButtonRule).toContain("line-height: 1");
    expect(iconRule).toContain("font-size: 1rem");
    expect(iconRule).toContain("line-height: 1");
    expect(hoverRule).toContain("border-color: var(--color-accent-start-border)");
    expect(languageRule).not.toContain("width: 2.25rem");
    expect(languageRule).not.toContain("height: 2.25rem");
  });

  it("uses a uniform full-width background for the current prayer row", () => {
    const css = readAppCss();
    const currentRowRule = getRuleBody(css, ".current-prayer-row td");
    const rtlCurrentRowRule = getRuleBody(css, '[dir="rtl"] .current-prayer-row td');

    expect(currentRowRule).toContain("background-color: var(--color-accent-start-tint)");
    expect(currentRowRule).not.toContain("linear-gradient");
    expect(rtlCurrentRowRule).toBe("");
  });
});
