import { Resend } from "resend";
import { createPreviewResumeUrl } from "@/lib/access-token";
import { REPORT_PRICE_LABEL } from "@/lib/preview";
import { formatCurrency } from "@/lib/utils";
import { BUSINESS_TYPE_LABELS } from "@/lib/types";
import type { BusinessType } from "@/lib/types";

interface NurtureEmailParams {
  to: string;
  diagnosticId: string;
  businessType: BusinessType;
  totalEstimatedLoss: number;
  lossRangeLabel: string;
}

function buildNurtureHtml(params: NurtureEmailParams): string {
  const resumeUrl = createPreviewResumeUrl(params.diagnosticId);
  const businessLabel = BUSINESS_TYPE_LABELS[params.businessType];

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 16px;color:#334155;line-height:1.6;">
                  You started a <strong>${businessLabel}</strong> revenue leak diagnostic. Your preview estimated
                  <strong style="color:#dc2626;">${params.lossRangeLabel}/month</strong> in recoverable losses
                  (directional, based on your answers).
                </p>
                <p style="margin:0 0 24px;color:#334155;line-height:1.6;">
                  Unlock the full breakdown — top 3 leaks, dollar amounts per category, and fix-first steps — for a
                  one-time <strong>${REPORT_PRICE_LABEL}</strong>.
                </p>
                <a href="${resumeUrl}" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 24px;border-radius:10px;">
                  View my preview &amp; unlock report
                </a>
                <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;line-height:1.5;">
                  Not interested? Ignore this email — we won&apos;t send another reminder for this diagnostic.
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

function buildNurtureText(params: NurtureEmailParams): string {
  const resumeUrl = createPreviewResumeUrl(params.diagnosticId);
  const businessLabel = BUSINESS_TYPE_LABELS[params.businessType];

  return `Your revenue leak preview is still available

You started a ${businessLabel} diagnostic. Your preview estimated ${params.lossRangeLabel}/month in directional losses.

Unlock the full report (top 3 leaks + fix-first steps) for ${REPORT_PRICE_LABEL}:
${resumeUrl}

Not interested? Ignore this — no further reminders for this diagnostic.
`;
}

export async function sendNurtureEmail(params: NurtureEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      console.log("\n--- Nurture email (set RESEND_API_KEY + EMAIL_FROM to send) ---");
      console.log(`To: ${params.to}`);
      console.log(buildNurtureText(params));
      console.log("---\n");
      return;
    }
    throw new Error("Email not configured. Set RESEND_API_KEY and EMAIL_FROM.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Your revenue leak preview (~${formatCurrency(params.totalEstimatedLoss)}/mo)`,
    html: buildNurtureHtml(params),
    text: buildNurtureText(params),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function getNurtureDelayMs(): number {
  const hours = Number(process.env.NURTURE_DELAY_HOURS ?? 24);
  if (!Number.isFinite(hours) || hours < 0) return 24 * 60 * 60 * 1000;
  return hours * 60 * 60 * 1000;
}
