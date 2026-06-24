import { createHmac, timingSafeEqual } from "crypto";
import { getAppUrl } from "@/lib/stripe";

export const PREVIEW_ACCESS_TTL_SEC = 7 * 24 * 60 * 60;
export const REPORT_ACCESS_TTL_SEC = 365 * 24 * 60 * 60;

function getSecret(): string {
  const secret = process.env.DIAGNOSTIC_ACCESS_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("DIAGNOSTIC_ACCESS_SECRET is not set");
  }
  return "dev-insecure-diagnostic-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createDiagnosticAccessToken(
  diagnosticId: string,
  ttlSeconds: number
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${diagnosticId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function createPreviewAccessToken(diagnosticId: string): string {
  return createDiagnosticAccessToken(diagnosticId, PREVIEW_ACCESS_TTL_SEC);
}

export function createReportAccessToken(diagnosticId: string): string {
  return createDiagnosticAccessToken(diagnosticId, REPORT_ACCESS_TTL_SEC);
}

export function verifyDiagnosticAccessToken(
  token: string,
  diagnosticId: string
): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [id, expStr, signature] = parts;
  if (id !== diagnosticId) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${id}.${expStr}`;
  const expected = sign(payload);

  try {
    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function createReportUrl(diagnosticId: string): string {
  const token = createReportAccessToken(diagnosticId);
  return `${getAppUrl()}/result/${diagnosticId}?token=${encodeURIComponent(token)}`;
}

export function createPreviewRestoreUrl(diagnosticId: string): string {
  const token = createPreviewAccessToken(diagnosticId);
  return `${getAppUrl()}/?cancelled=${diagnosticId}&token=${encodeURIComponent(token)}`;
}

export function createPreviewResumeUrl(diagnosticId: string): string {
  const token = createPreviewAccessToken(diagnosticId);
  return `${getAppUrl()}/?resume=${diagnosticId}&token=${encodeURIComponent(token)}`;
}
