import { formatCurrency } from "./utils";
import type { LossRange } from "./types";

/** Convert a point estimate into a readable range for preview anchoring */
export function bandTotalLoss(total: number): LossRange {
  if (total <= 0) {
    return { low: 0, high: 0, label: "$0" };
  }

  const low = Math.round(total * 0.75 / 100) * 100;
  const high = Math.round(total * 1.25 / 100) * 100;

  return {
    low: Math.max(low, 100),
    high: Math.max(high, low + 100),
    label: `${formatCurrency(low)}–${formatCurrency(high)}`,
  };
}

export const REPORT_PRICE_CENTS = Number(
  process.env.STRIPE_CHECKOUT_AMOUNT_CENTS ?? 2900
);
export const REPORT_PRICE_LABEL = formatCurrency(REPORT_PRICE_CENTS / 100);
