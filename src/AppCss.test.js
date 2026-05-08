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

  it("uses a uniform full-width background for the current prayer row", () => {
    const css = readAppCss();
    const currentRowRule = getRuleBody(css, ".current-prayer-row td");
    const rtlCurrentRowRule = getRuleBody(css, '[dir="rtl"] .current-prayer-row td');

    expect(currentRowRule).toContain("background-color: var(--color-accent-start-tint)");
    expect(currentRowRule).not.toContain("linear-gradient");
    expect(rtlCurrentRowRule).toBe("");
  });
});
