/**
 * Verifies the paid report flow without a browser.
 *
 * Usage:
 *   npm run test:paid-flow
 *   npm run test:paid-flow -- --base-url http://localhost:3000
 *
 * Optional live Stripe check (creates a Checkout Session; does not complete payment):
 *   npm run test:paid-flow -- --stripe
 *
 * Manual Stripe test card after opening checkout URL:
 *   4242 4242 4242 4242 · any future expiry · any CVC
 *   Run `npm run stripe:listen` in another terminal for webhooks.
 */

import { prisma } from "../lib/prisma";
import { fulfillPaidDiagnostic } from "../lib/fulfill-diagnostic";
import { SAAS_LEAKY_ANSWERS, SAAS_BUSINESS_TYPE } from "../lib/fixtures";

const args = process.argv.slice(2);
// Log report email to console instead of sending when Resend is not configured
if (!process.env.RESEND_API_KEY) {
  process.env.ALLOW_CONSOLE_EMAIL = "1";
}
const baseUrl =
  args.find((a) => a.startsWith("--base-url="))?.split("=")[1] ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";
const runStripe = args.includes("--stripe");

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function main() {
  console.log("\nRevenue Leak — paid flow verification\n");

  try {
    const health = await fetch(baseUrl);
    if (!health.ok) throw new Error(`App not reachable at ${baseUrl}`);
  } catch {
    console.error(`Start the app first: npm run dev  (expected at ${baseUrl})`);
    process.exit(1);
  }

  const { res: createRes, data: created } = await fetchJson(`${baseUrl}/api/diagnostic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      businessType: SAAS_BUSINESS_TYPE,
      answers: SAAS_LEAKY_ANSWERS,
    }),
  });

  if (!createRes.ok) {
    console.error("Failed to create diagnostic:", created);
    process.exit(1);
  }

  const diagnosticId = created.id as string;
  const previewToken = created.accessToken as string;
  console.log(`✓ Created diagnostic ${diagnosticId}`);

  const { res: patchRes } = await fetchJson(`${baseUrl}/api/diagnostic`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: diagnosticId,
      email: "paid-flow@example.com",
      token: previewToken,
    }),
  });
  if (!patchRes.ok) {
    console.error("Failed to save email");
    process.exit(1);
  }
  console.log("✓ Email captured");

  if (runStripe) {
    const { res: checkoutRes, data: checkout } = await fetchJson(
      `${baseUrl}/api/stripe/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosticId, token: previewToken }),
      }
    );
    if (checkoutRes.ok && checkout.url) {
      console.log(`✓ Stripe Checkout URL: ${checkout.url}`);
      console.log("  Complete payment manually with test card 4242 4242 4242 4242");
    } else {
      console.log("⚠ Stripe checkout not configured:", checkout.error ?? checkoutRes.status);
    }
  }

  const fulfill = await fulfillPaidDiagnostic(diagnosticId, {
    email: "paid-flow@example.com",
    stripeSessionId: "cs_test_verify_paid_flow",
  });
  console.log(`✓ Fulfilled (email sent: ${fulfill.emailSent})`);

  const { res: apiRes, data: report } = await fetchJson(
    `${baseUrl}/api/diagnostic?id=${diagnosticId}&token=${encodeURIComponent(previewToken)}`
  );
  if (!apiRes.ok || !report.isPaid || !report.topLeaks?.length) {
    console.error("Report API check failed:", report);
    process.exit(1);
  }
  const reportToken = (report.reportAccessToken as string) ?? previewToken;
  console.log(`✓ Paid report API returns ${report.topLeaks.length} top leaks`);

  const reportUrl = `${baseUrl}/result/${diagnosticId}?token=${encodeURIComponent(reportToken)}`;

  const pageRes = await fetch(reportUrl);
  if (!pageRes.ok) {
    console.error("Report page failed:", pageRes.status);
    process.exit(1);
  }
  const html = await pageRes.text();
  if (!html.includes("Your Revenue Leak Report")) {
    console.error("Report page missing expected heading");
    process.exit(1);
  }
  console.log("✓ Report page renders");

  console.log("\nOpen in browser:");
  console.log(reportUrl);
  console.log("\nResume preview (nurture link pattern):");
  console.log(`${baseUrl}/?resume=${diagnosticId}&token=${encodeURIComponent(previewToken)}`);
  console.log("");

  await prisma.diagnostic.delete({ where: { id: diagnosticId } }).catch(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
