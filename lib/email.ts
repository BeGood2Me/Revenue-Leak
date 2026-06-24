import { Resend } from "resend";
import { createReportUrl } from "@/lib/access-token";
import { formatCurrency } from "@/lib/utils";
import { BUSINESS_TYPE_LABELS, LEAK_CATEGORY_LABELS } from "@/lib/types";
import type { BusinessType, LeakInsight } from "@/lib/types";
import { getHeroRecommendation } from "@/lib/insights";

interface ReportEmailParams {
  to: string;
  diagnosticId: string;
  businessType: BusinessType;
  totalEstimatedLoss: number;
  topLeaks: LeakInsight[];
}

function buildReportEmailHtml(params: ReportEmailParams): string {
  const reportUrl = createReportUrl(params.diagnosticId);
  const businessLabel = BUSINESS_TYPE_LABELS[params.businessType];
  const hero = getHeroRecommendation(params.topLeaks[0]);

  const topLeaksHtml = params.topLeaks
    .map(
      (leak, i) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
            <strong style="color:#0f172a;">#${i + 1} ${LEAK_CATEGORY_LABELS[leak.category]}</strong><br/>
            <span style="color:#dc2626;font-weight:600;">${formatCurrency(leak.estimatedMonthlyLoss)}/month estimated loss</span>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#006fc7;padding:24px 28px;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;">Your Revenue Leak Report is ready</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;color:#334155;line-height:1.6;">
                  Thanks for your purchase. Your full <strong>${businessLabel}</strong> diagnostic report is ready to view.
                </p>
                <p style="margin:0 0 8px;color:#64748b;font-size:14px;">Total estimated monthly revenue loss</p>
                <p style="margin:0 0 24px;color:#dc2626;font-size:28px;font-weight:700;">${formatCurrency(params.totalEstimatedLoss)}</p>
                ${hero ? `<p style="margin:0 0 16px;padding:12px 16px;background:#f0f9ff;border-radius:8px;color:#334155;font-size:14px;line-height:1.5;"><strong>Start here:</strong> ${hero}</p>` : ""}
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${topLeaksHtml}</table>
                <a href="${reportUrl}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 24px;border-radius:10px;">
                  View your full report
                </a>
                <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;line-height:1.5;">
                  Bookmark this link to return anytime:<br/>
                  <a href="${reportUrl}" style="color:#006fc7;">${reportUrl}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildReportEmailText(params: ReportEmailParams): string {
  const reportUrl = createReportUrl(params.diagnosticId);
  const businessLabel = BUSINESS_TYPE_LABELS[params.businessType];
  const hero = getHeroRecommendation(params.topLeaks[0]);
  const topLeaksText = params.topLeaks
    .map(
      (leak, i) =>
        `${i + 1}. ${LEAK_CATEGORY_LABELS[leak.category]} — ${formatCurrency(leak.estimatedMonthlyLoss)}/month`
    )
    .join("\n");

  return `Your Revenue Leak Report is ready

Thanks for your purchase. Your full ${businessLabel} diagnostic report is ready.

Total estimated monthly revenue loss: ${formatCurrency(params.totalEstimatedLoss)}

${hero ? `Start here: ${hero}\n\n` : ""}Top leaks:
${topLeaksText}

View your full report:
${reportUrl}
`;
}

export async function sendReportEmail(params: ReportEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test" ||
      process.env.ALLOW_CONSOLE_EMAIL === "1"
    ) {
      console.log("\n--- Report email (set RESEND_API_KEY + EMAIL_FROM to send) ---");
      console.log(`To: ${params.to}`);
      console.log(buildReportEmailText(params));
      console.log("---\n");
      return;
    }
    throw new Error("Email not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Your Revenue Leak Report is ready",
    html: buildReportEmailHtml(params),
    text: buildReportEmailText(params),
  });

  if (error) {
    throw new Error(error.message);
  }
}
