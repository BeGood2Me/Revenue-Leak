import Link from "next/link";
import { Button } from "@/components/Button";

interface GuideCtaProps {
  headline?: string;
  subline?: string;
  href?: string;
}

export function GuideCta({
  headline = "Find your top 3 revenue leaks in 5 minutes",
  subline = "Free preview · Full report optional",
  href = "/?fresh=1#start",
}: GuideCtaProps) {
  return (
    <div className="!mt-10 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
      <p className="text-lg font-semibold text-slate-900">{headline}</p>
      <p className="mt-2 text-slate-600">{subline}</p>
      <Link href={href} className="mt-4 inline-block">
        <Button size="lg">Start free diagnostic</Button>
      </Link>
    </div>
  );
}
