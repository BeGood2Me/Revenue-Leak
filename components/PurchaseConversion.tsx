"use client";

import { useEffect } from "react";
import {
  hasTrackedPurchase,
  markPurchaseTracked,
  trackPurchase,
} from "@/lib/track";

interface PurchaseConversionProps {
  sessionId: string;
}

export function PurchaseConversion({ sessionId }: PurchaseConversionProps) {
  useEffect(() => {
    if (!sessionId || hasTrackedPurchase(sessionId)) return;
    markPurchaseTracked(sessionId);
    trackPurchase(sessionId);
  }, [sessionId]);

  return null;
}
