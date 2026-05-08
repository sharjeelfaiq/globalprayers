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

    expect(tableShellRule).toContain("width: min(100%, 31rem)");
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
    expect(topRowRule).toContain("align-items: start");
    expect(currentTimeRule).toContain("grid-column: 1");
    expect(currentTimeRule).toContain("justify-self: start");
    expect(currentTimeRule).toContain("text-align: start");
    expect(currentTimeRule).toContain("font-size: clamp(1.08rem, 4vw, 1.45rem)");
    expect(currentTimeRule).toContain("font-variant-numeric: tabular-nums");
    expect(statusRowRule).toContain("grid-column: 2");
    expect(statusRowRule).toContain("justify-self: end");
    expect(toggleRule).toContain("min-height: 1.4rem");
    expect(toggleRule).toContain("padding: 0.16rem clamp(0.28rem, 1.4vw, 0.42rem)");
    expect(toggleRule).toContain("font-size: 0.62rem");
    expect(toggleRule).toContain("border-radius: var(--radius-sm)");
    expect(toggleRule).toContain("white-space: nowrap");
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
