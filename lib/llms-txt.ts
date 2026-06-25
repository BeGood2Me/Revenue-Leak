import { FAQ_ITEMS } from "@/lib/faq";
import {
  getContactEmail,
  getSiteUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site";

export function buildLlmsTxt(): string {
  const base = getSiteUrl();
  const contactEmail = getContactEmail();

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION} Paid full report unlocks ranked leaks, fix-first recommendations, and a 30-day action plan.`,
    "",
    "## Product",
    "",
    `- [Start diagnostic](${base}/): Free 5-minute questionnaire for SaaS, ecommerce, agency, and service businesses`,
    `- [Privacy Policy](${base}/privacy): How we collect, use, and protect your data`,
    `- [Terms of Service](${base}/terms): Pricing ($29 one-time report), refunds, and service terms`,
    "",
    "## What it does",
    "",
    "- Scans six leak categories: acquisition, response, conversion, retention, billing/recovery, and expansion",
    "- Shows a free preview with estimated monthly revenue loss",
    "- Unlocks a full written report after one-time Stripe checkout",
    "",
    "## Common questions",
    "",
    ...FAQ_ITEMS.map(
      (item) => `- **${item.q}** ${item.a}`
    ),
  ];

  if (contactEmail) {
    lines.push("", "## Contact", "", `- Support email: ${contactEmail}`);
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [Sitemap](${base}/sitemap.xml): Machine-readable list of public pages`,
    `- [Robots](${base}/robots.txt): Crawler rules (private report URLs are disallowed)`
  );

  return `${lines.join("\n")}\n`;
}
