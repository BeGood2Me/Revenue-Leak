/**
 * Crawl all public marketing routes and report failures.
 * Usage: node scripts/check-pages.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "http://localhost:3010").replace(/\/$/, "");

const staticPaths = [
  "/",
  "/about",
  "/blog",
  "/guides",
  "/privacy",
  "/terms",
  "/sample-report",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/images/revenue-leak-logo.svg",
  "/images/social/revenue-leak-diagnostic-preview",
];

const blogPosts = [
  "revenue-leakage-examples",
  "agency-proposal-leakage",
  "cart-abandonment-revenue-leak",
  "failed-payment-recovery",
  "funnel-conversion-leaks",
  "identify-profit-leaks",
  "revenue-leakage-analysis",
  "revenue-leakage-detection",
  "revenue-leakage-meaning",
  "saas-revenue-leakage",
  "subscription-billing-leaks",
  "what-is-revenue-leakage",
];

const blogPillars = ["billing-recovery", "funnel-profit-leaks", "revenue-leakage"];

const guides = [
  "revenue-leakage-analysis",
  "revenue-leakage-examples",
  "revenue-leakage-detection",
  "identify-profit-leaks",
  "failed-payment-recovery",
];

const niches = ["saas", "ecommerce", "agencies", "local-services"];

for (const slug of blogPosts) staticPaths.push(`/blog/${slug}`);
for (const slug of blogPillars) staticPaths.push(`/blog/pillar/${slug}`);
for (const slug of guides) {
  staticPaths.push(`/guides/${slug}`);
  staticPaths.push(`/images/social/guides/${slug}`);
}
for (const slug of niches) staticPaths.push(`/for/${slug}`);

const errorPatterns = [
  /Application error/i,
  /Internal Server Error/i,
  /This page could not be found/i,
  /Unhandled Runtime Error/i,
  /Hydration failed/i,
  /Error: /,
];

async function check(path) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const contentType = res.headers.get("content-type") ?? "";
    const body = contentType.includes("text") || contentType.includes("xml") || contentType.includes("json")
      ? await res.text()
      : "";

    const issues = [];
    if (!res.ok) issues.push(`HTTP ${res.status}`);
    if (body && errorPatterns.some((re) => re.test(body))) {
      issues.push("error text in body");
    }
    if (path === "/" && body && !body.includes("Revenue Leak")) {
      issues.push("missing brand on homepage");
    }

    return { path, ok: issues.length === 0, status: res.status, issues };
  } catch (error) {
    return { path, ok: false, status: 0, issues: [error.message] };
  }
}

console.log(`Checking ${staticPaths.length} routes at ${base}\n`);

const results = [];
for (const path of staticPaths) {
  results.push(await check(path));
}

const failed = results.filter((r) => !r.ok);
const passed = results.filter((r) => r.ok);

for (const r of passed) {
  console.log(`OK   ${r.status} ${r.path}`);
}

if (failed.length) {
  console.log("");
  for (const r of failed) {
    console.log(`FAIL ${r.status} ${r.path} — ${r.issues.join(", ")}`);
  }
  process.exit(1);
}

console.log(`\nAll ${passed.length} routes passed.`);
