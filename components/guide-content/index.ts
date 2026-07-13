import type { ComponentType } from "react";
import { FailedPaymentRecoveryContent } from "./FailedPaymentRecovery";
import { IdentifyProfitLeaksContent } from "./IdentifyProfitLeaks";
import { RevenueLeakageAnalysisContent } from "./RevenueLeakageAnalysis";
import { RevenueLeakageDetectionContent } from "./RevenueLeakageDetection";
import { RevenueLeakageExamplesContent } from "./RevenueLeakageExamples";

export const guideContentBySlug: Record<string, ComponentType> = {
  "revenue-leakage-analysis": RevenueLeakageAnalysisContent,
  "revenue-leakage-examples": RevenueLeakageExamplesContent,
  "revenue-leakage-detection": RevenueLeakageDetectionContent,
  "identify-profit-leaks": IdentifyProfitLeaksContent,
  "failed-payment-recovery": FailedPaymentRecoveryContent,
};
