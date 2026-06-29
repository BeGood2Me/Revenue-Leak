/**
 * Notify IndexNow (Bing, etc.) of public URLs.
 * Usage: node scripts/submit-indexnow.mjs
 * Requires INDEXNOW_KEY and NEXT_PUBLIC_APP_URL (or defaults for production).
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

const urlList = [
  appUrl,
  `${appUrl}/privacy`,
  `${appUrl}/terms`,
  `${appUrl}/sample-report`,
];

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
