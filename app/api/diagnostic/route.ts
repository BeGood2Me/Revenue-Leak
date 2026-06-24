import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runDiagnostic } from "@/lib/diagnostic";
import { bandTotalLoss } from "@/lib/preview";
import { computeFunnelHealthScore } from "@/lib/health-score";
import {
  createPreviewAccessToken,
  createReportAccessToken,
  createReportUrl,
  verifyDiagnosticAccessToken,
} from "@/lib/access-token";
import { normalizeEmail, isValidEmail } from "@/lib/utils";
import type { Answers, BusinessType, LeakCategory } from "@/lib/types";
import { LEAK_CATEGORY_LABELS } from "@/lib/types";
import { enforceRateLimit } from "@/lib/api-rate-limit";

function unauthorizedTokenResponse() {
  return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
}

function verifyTokenForDiagnostic(token: unknown, diagnosticId: string): boolean {
  return (
    typeof token === "string" &&
    token.length > 0 &&
    verifyDiagnosticAccessToken(token, diagnosticId)
  );
}

function buildPreviewPayload(
  id: string,
  businessType: BusinessType,
  result: ReturnType<typeof runDiagnostic>,
  isPaid: boolean
) {
  const topLeak = result.topLeaks[0];
  const lossRange = bandTotalLoss(result.totalEstimatedLoss);

  return {
    id,
    businessType,
    leakScores: result.leakScores,
    estimatedLosses: result.estimatedLosses,
    healthScore: computeFunnelHealthScore(result.leakScores),
    totalEstimatedLoss: result.totalEstimatedLoss,
    lossRange,
    topLeakCategory: topLeak?.category ?? null,
    topLeakLabel: topLeak
      ? LEAK_CATEGORY_LABELS[topLeak.category as LeakCategory]
      : null,
    topLeakSeverity: topLeak?.severity ?? 0,
    isPaid,
    accessToken: createPreviewAccessToken(id),
  };
}

export async function POST(request: Request) {
  try {
    const rateLimited = enforceRateLimit(request, "diagnostic:create");
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const businessType = body.businessType as BusinessType;
    const answers = body.answers as Answers;
    const email = body.email ? normalizeEmail(String(body.email)) : undefined;

    if (!businessType || !["saas", "ecommerce", "agency", "service"].includes(businessType)) {
      return NextResponse.json({ error: "Invalid business type" }, { status: 400 });
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const result = runDiagnostic(businessType, answers);

    const diagnostic = await prisma.diagnostic.create({
      data: {
        businessType,
        answers: JSON.stringify(answers),
        leakScores: JSON.stringify(result.leakScores),
        estimatedLosses: JSON.stringify(result.estimatedLosses),
        totalEstimatedLoss: result.totalEstimatedLoss,
        isPaid: false,
        email: email ?? null,
      },
    });

    return NextResponse.json(
      buildPreviewPayload(diagnostic.id, businessType, result, diagnostic.isPaid)
    );
  } catch (error) {
    console.error("Diagnostic creation error:", error);
    return NextResponse.json(
      { error: "Failed to create diagnostic" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const rateLimited = enforceRateLimit(request, "diagnostic:update");
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const { id, email, token } = body;

    if (!id) {
      return NextResponse.json({ error: "Diagnostic id is required" }, { status: 400 });
    }

    if (!verifyTokenForDiagnostic(token, id)) {
      return unauthorizedTokenResponse();
    }

    if (!email || !isValidEmail(String(email))) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const diagnostic = await prisma.diagnostic.findUnique({ where: { id } });
    if (!diagnostic) {
      return NextResponse.json({ error: "Diagnostic not found" }, { status: 404 });
    }

    if (diagnostic.isPaid) {
      return NextResponse.json(
        {
          error: "This diagnostic has already been paid and cannot be updated",
          url: createReportUrl(id),
        },
        { status: 400 }
      );
    }

    const updated = await prisma.diagnostic.update({
      where: { id },
      data: {
        email: normalizeEmail(String(email)),
        emailCapturedAt: diagnostic.emailCapturedAt ?? new Date(),
      },
    });

    const answers = JSON.parse(updated.answers);
    const result = runDiagnostic(updated.businessType as BusinessType, answers);

    return NextResponse.json(
      buildPreviewPayload(
        updated.id,
        updated.businessType as BusinessType,
        result,
        updated.isPaid
      )
    );
  } catch (error) {
    console.error("Diagnostic update error:", error);
    return NextResponse.json(
      { error: "Failed to update diagnostic" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const rateLimited = enforceRateLimit(request, "diagnostic:update");
    if (rateLimited) return rateLimited;

    const body = await request.json();
    const id = body.id as string | undefined;
    const businessType = body.businessType as BusinessType;
    const answers = body.answers as Answers;
    const token = body.token as string | undefined;

    if (!id) {
      return NextResponse.json({ error: "Diagnostic id is required" }, { status: 400 });
    }

    if (!verifyTokenForDiagnostic(token, id)) {
      return unauthorizedTokenResponse();
    }

    if (!businessType || !["saas", "ecommerce", "agency", "service"].includes(businessType)) {
      return NextResponse.json({ error: "Invalid business type" }, { status: 400 });
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    const diagnostic = await prisma.diagnostic.findUnique({ where: { id } });
    if (!diagnostic) {
      return NextResponse.json({ error: "Diagnostic not found" }, { status: 404 });
    }

    if (diagnostic.isPaid) {
      return NextResponse.json(
        {
          error: "This diagnostic has already been paid and cannot be updated",
          url: createReportUrl(id),
        },
        { status: 400 }
      );
    }

    const result = runDiagnostic(businessType, answers);

    const updated = await prisma.diagnostic.update({
      where: { id },
      data: {
        businessType,
        answers: JSON.stringify(answers),
        leakScores: JSON.stringify(result.leakScores),
        estimatedLosses: JSON.stringify(result.estimatedLosses),
        totalEstimatedLoss: result.totalEstimatedLoss,
      },
    });

    return NextResponse.json(
      buildPreviewPayload(updated.id, businessType, result, updated.isPaid)
    );
  } catch (error) {
    console.error("Diagnostic replace error:", error);
    return NextResponse.json(
      { error: "Failed to update diagnostic" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const rateLimited = enforceRateLimit(request, "diagnostic:read");
    if (rateLimited) return rateLimited;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!token || !verifyDiagnosticAccessToken(token, id)) {
      return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 });
    }

    const diagnostic = await prisma.diagnostic.findUnique({ where: { id } });

    if (!diagnostic) {
      return NextResponse.json({ error: "Diagnostic not found" }, { status: 404 });
    }

    const answers = JSON.parse(diagnostic.answers);
    const businessType = diagnostic.businessType as BusinessType;
    const result = runDiagnostic(businessType, answers);
    const preview = buildPreviewPayload(
      diagnostic.id,
      businessType,
      result,
      diagnostic.isPaid
    );

    const base = {
      ...preview,
      answers,
      email: diagnostic.email,
      createdAt: diagnostic.createdAt,
    };

    if (!diagnostic.isPaid) {
      return NextResponse.json(base);
    }

    return NextResponse.json({
      ...base,
      reportAccessToken: createReportAccessToken(diagnostic.id),
      estimatedLosses: result.estimatedLosses,
      topLeaks: result.topLeaks,
      allLeaks: result.allLeaks,
    });
  } catch (error) {
    console.error("Diagnostic fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch diagnostic" },
      { status: 500 }
    );
  }
}
