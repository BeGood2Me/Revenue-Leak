import type { LeakScores } from "./types";
import { LEAK_CATEGORIES } from "./types";

/** 0–100 funnel health (100 = healthy, 0 = severe leaks across the board) */
export function computeFunnelHealthScore(scores: LeakScores): number {
  const avgSeverity =
    LEAK_CATEGORIES.reduce((sum, cat) => sum + scores[cat], 0) / LEAK_CATEGORIES.length;
  return Math.max(0, Math.min(100, Math.round(100 - avgSeverity)));
}

export function getHealthScoreLabel(score: number): string {
  if (score >= 70) return "Healthy";
  if (score >= 45) return "Needs attention";
  return "At risk";
}
