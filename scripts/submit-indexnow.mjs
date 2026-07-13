/**
 * Notify IndexNow (Bing, etc.) of public URLs.
 * Usage: node scripts/submit-indexnow.mjs
 * Requires INDEXNOW_KEY and NEXT_PUBLIC_APP_URL (or defaults for production).
 *
 * Fetches URLs from the live sitemap when available; falls back to a static list.
 */
const key = process.env.INDEXNOW_KEY?.trim();
const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.revenueleak.report").replace(
  /\/$/,
  ""
);

if (!key) {
  console.error("Set INDEXNOW_KEY in the environment.");
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
