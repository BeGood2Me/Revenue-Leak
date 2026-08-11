/**
 * Notify IndexNow (Bing, etc.) of public URLs.
 * Usage: npm run indexnow:submit
 *
 * Resolves INDEXNOW_KEY from (in order):
 *   1. process.env.INDEXNOW_KEY
 *   2. .env.local / .env
 *   3. public/<key>.txt (IndexNow verification file)
 *
 * NEXT_PUBLIC_APP_URL defaults to production.
 *
 * Fetches URLs from the live sitemap when available; falls back to a static list.
 */
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import {
  ENV_FILE,
  ENV_LOCAL,
  getEnvValue,
  isPlaceholderValue,
  readEnvFile,
  ROOT,
} from "./lib/env-file.mjs";

function resolveIndexNowKey() {
  const fromEnv = process.env.INDEXNOW_KEY?.trim();
  if (fromEnv && !isPlaceholderValue(fromEnv)) return fromEnv;

  for (const path of [ENV_LOCAL, ENV_FILE]) {
    const fromFile = getEnvValue(readEnvFile(path), "INDEXNOW_KEY");
    if (fromFile && !isPlaceholderValue(fromFile)) return fromFile;
  }

  const publicDir = join(ROOT, "public");
  try {
    for (const name of readdirSync(publicDir)) {
      if (!/^[a-f0-9]{32}\.txt$/i.test(name)) continue;
      const key = name.slice(0, -4);
      const body = readFileSync(join(publicDir, name), "utf8").trim();
      if (body === key || body === "") return key;
    }
  } catch {
    // public/ missing or unreadable
  }

  return null;
}

function resolveAppUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  for (const path of [ENV_LOCAL, ENV_FILE]) {
    const fromFile = getEnvValue(readEnvFile(path), "NEXT_PUBLIC_APP_URL");
    // Localhost is fine for Next, but IndexNow must submit the public host.
    if (fromFile && !fromFile.includes("localhost")) {
      return fromFile.replace(/\/$/, "");
    }
  }

  return "https://www.revenueleak.report";
}

const key = resolveIndexNowKey();
const appUrl = resolveAppUrl();

if (!key) {
  console.error(
    "Could not find INDEXNOW_KEY. Set it in .env.local, or add public/<32-char-hex-key>.txt"
  );
  process.exit(1);
}

const host = new URL(appUrl).host;
const keyLocation = `${appUrl}/${key}.txt`;

const fallbackUrlList = [
  appUrl,
  `${appUrl}/privacy`,
  `${appUrl}/terms`,
  `${appUrl}/sample-report`,
  `${appUrl}/guides`,
  `${appUrl}/guides/revenue-leakage-analysis`,
  `${appUrl}/guides/revenue-leakage-examples`,
  `${appUrl}/guides/revenue-leakage-detection`,
  `${appUrl}/guides/identify-profit-leaks`,
  `${appUrl}/guides/failed-payment-recovery`,
  `${appUrl}/for/saas`,
  `${appUrl}/for/ecommerce`,
  `${appUrl}/for/agencies`,
  `${appUrl}/for/local-services`,
];

async function getUrlList() {
  try {
    const res = await fetch(`${appUrl}/sitemap.xml`, {
      headers: { Accept: "application/xml,text/xml" },
    });
    if (!res.ok) {
      console.warn(`Could not fetch sitemap (${res.status}); using fallback URL list.`);
      return fallbackUrlList;
    }

    const xml = await res.text();
    const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) =>
      match[1].trim()
    );

    if (urls.length === 0) {
      console.warn("Sitemap had no URLs; using fallback URL list.");
      return fallbackUrlList;
    }

    return [...new Set(urls)];
  } catch (error) {
    console.warn(`Sitemap fetch failed (${error.message}); using fallback URL list.`);
    return fallbackUrlList;
  }
}

const urlList = await getUrlList();

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList }),
});

if (res.ok || res.status === 202) {
  console.log(`IndexNow submitted ${urlList.length} URL(s) for ${host} (${res.status})`);
  for (const url of urlList) console.log(`  - ${url}`);
} else {
  const text = await res.text();
  console.error(`IndexNow failed (${res.status}): ${text || res.statusText}`);
  process.exit(1);
}
