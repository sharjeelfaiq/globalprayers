import fs from "fs";
import path from "path";

const rootDir = path.join(__dirname, "..");
const readPublicFile = (filePath) =>
  fs.readFileSync(path.join(rootDir, "public", filePath), "utf8");
const readRootFile = (filePath) =>
  fs.readFileSync(path.join(rootDir, filePath), "utf8");

const getMetaContent = (html, attribute, value) => {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(
    new RegExp(`<meta\\s+${attribute}="${escapedValue}"\\s+content="([^"]+)"\\s*/?>`, "m")
  );

  return match?.[1] ?? "";
};

describe("app metadata", () => {
  it("uses Global Prayers branding in crawler-visible HTML metadata", () => {
    const html = readPublicFile("index.html");

    expect(html).toContain("<title>Global Prayers</title>");
    expect(getMetaContent(html, "name", "application-name")).toBe("Global Prayers");
    expect(getMetaContent(html, "name", "description")).toBe(
      "Global Prayers provides accurate daily Islamic prayer times, current prayer progress, and global location-based schedules for Muslims worldwide."
    );
    expect(getMetaContent(html, "name", "keywords")).toBe(
      "Global Prayers, prayer times, Islamic prayer schedule, salah times, namaz times, Muslim prayer app, Fajr, Dhuhr, Asr, Maghrib, Isha"
    );
    expect(getMetaContent(html, "name", "robots")).toBe("index, follow");
    expect(html).toContain('<link rel="canonical" href="https://globalprayers.app/" />');
  });

  it("defines Open Graph and Twitter card metadata for social previews", () => {
    const html = readPublicFile("index.html");

    expect(getMetaContent(html, "property", "og:title")).toBe("Global Prayers");
    expect(getMetaContent(html, "property", "og:type")).toBe("website");
    expect(getMetaContent(html, "property", "og:url")).toBe("https://globalprayers.app/");
    expect(getMetaContent(html, "property", "og:site_name")).toBe("Global Prayers");
    expect(getMetaContent(html, "property", "og:image")).toBe(
      "https://globalprayers.app/favicon_io/android-chrome-512x512.png"
    );
    expect(getMetaContent(html, "name", "twitter:card")).toBe("summary_large_image");
    expect(getMetaContent(html, "name", "twitter:title")).toBe("Global Prayers");
    expect(getMetaContent(html, "name", "twitter:image")).toBe(
      "https://globalprayers.app/favicon_io/android-chrome-512x512.png"
    );
  });

  it("keeps manifest branding aligned with the app identity", () => {
    const html = readPublicFile("index.html");
    const manifest = JSON.parse(readPublicFile("favicon_io/site.webmanifest"));

    expect(html.match(/rel="manifest"/g)).toHaveLength(1);
    expect(html).toContain('<link rel="manifest" href="./favicon_io/site.webmanifest" />');
    expect(manifest.name).toBe("Global Prayers");
    expect(manifest.short_name).toBe("Global Prayers");
    expect(manifest.description).toBe(
      "Accurate daily Islamic prayer times and global location-based prayer schedules."
    );
  });

  it("uses Global Prayers in package identity and indexing signals", () => {
    const packageJson = JSON.parse(readRootFile("package.json"));
    const robots = readPublicFile("robots.txt");

    expect(packageJson.name).toBe("global-prayers");
    expect(robots).toContain("Sitemap: https://globalprayers.app/sitemap.xml");
    expect(readPublicFile("sitemap.xml")).toContain("<loc>https://globalprayers.app/</loc>");
  });
});
