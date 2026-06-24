import type { LeakInsight, LeakRecommendation } from "./types";

export function buildActionPlan(topLeaks: LeakInsight[]): {
  week1: string[];
  week2: string[];
  week3: string[];
  week4: string[];
} {
  const quickWins = topLeaks
    .flatMap((leak) => leak.recommendations.filter((r) => r.effort === "quick").map((r) => r.text))
    .slice(0, 3);

  const medium = topLeaks
    .flatMap((leak) => leak.recommendations.filter((r) => r.effort === "medium").map((r) => r.text))
    .slice(0, 3);

  const strategic = topLeaks
    .flatMap((leak) => leak.recommendations.filter((r) => r.effort === "strategic").map((r) => r.text))
    .slice(0, 2);

  return {
    week1: quickWins.length > 0 ? quickWins : ["Review your #1 leak category and pick one fix to ship this week."],
    week2: medium.length > 0 ? medium.slice(0, 2) : ["Measure impact from week 1 changes and tackle the next highest-loss category."],
    week3: medium.length > 2 ? medium.slice(2) : strategic.slice(0, 1).length > 0 ? strategic.slice(0, 1) : ["Standardize what's working into a repeatable process."],
    week4: strategic.length > 0 ? strategic : ["Re-run this diagnostic to see if your funnel health score improved."],
  };
}

export function getQuickWins(leaks: LeakInsight[], limit = 3): string[] {
  return leaks
    .flatMap((leak) => leak.recommendations.filter((r) => r.effort === "quick").map((r) => r.text))
    .slice(0, limit);
}

export function effortLabel(effort: LeakRecommendation["effort"]): string {
  switch (effort) {
    case "quick":
      return "Quick win";
    case "medium":
      return "Medium effort";
    case "strategic":
      return "Strategic";
  }
}
