import { NextResponse } from "next/server";
import { processNurtureBatch } from "@/lib/nurture-dispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
  }
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        hint: "Set CRON_SECRET in Vercel — Vercel sends Authorization: Bearer <CRON_SECRET> for cron jobs.",
      },
      { status: 401 }
    );
  }

  const batchLimit = Number(process.env.NURTURE_BATCH_LIMIT ?? 50);
  const result = await processNurtureBatch(
    Number.isFinite(batchLimit) ? batchLimit : 50
  );

  return NextResponse.json(result);
}
