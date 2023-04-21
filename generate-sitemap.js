import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fg from "fast-glob";
import { SitemapStream, streamToPromise } from "sitemap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseUrl = "https://www.referblock.xyz/";

(async () => {
  const pages = await fg("./src/pages/**/*.{astro,md}");
  const urls = pages.map((page) =>
    page.replace(/^\.\/src\/pages/, "").replace(/(index)?\.(astro|md)$/, "")
  );

  const sitemap = new SitemapStream({ hostname: baseUrl });
  urls.forEach((url) => sitemap.write({ url }));

  sitemap.end();
  const sitemapData = await streamToPromise(sitemap);
  fs.writeFileSync(join(__dirname, "public", "sitemap.xml"), sitemapData);
})();
