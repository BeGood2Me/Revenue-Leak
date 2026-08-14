"use client";

import { useEffect, useState } from "react";

interface PreviewShareCardProps {
  lossRangeLabel: string;
  topLeakLabel: string | null;
  diagnosticId: string;
  token: string | null;
}

export function PreviewShareCard({
  lossRangeLabel,
  topLeakLabel,
  diagnosticId,
  token,
}: PreviewShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const line = topLeakLabel
    ? `Estimated ${lossRangeLabel}/month leaking — #1 leak: ${topLeakLabel}`
    : `Estimated ${lossRangeLabel}/month leaking`;

  useEffect(() => {
    const params = new URLSearchParams({ resume: diagnosticId });
    if (token) params.set("token", token);
    setShareUrl(`${window.location.origin}/?${params.toString()}`);
  }, [diagnosticId, token]);

  const mailto = `mailto:?subject=${encodeURIComponent("Revenue leak preview")}&body=${encodeURIComponent(`${line}\n\n${shareUrl}`)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(`${line}\n${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
      <p className="text-sm font-medium text-slate-900">{line}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <a
          href={mailto}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Send to a cofounder
        </a>
      </div>
    </div>
  );
}
