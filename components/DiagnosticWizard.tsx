"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Answers, BusinessType, EstimatedLosses, LeakCategory } from "@/lib/types";
import { BUSINESS_TYPE_LABELS, LEAK_CATEGORIES } from "@/lib/types";
import { getQuestionSteps } from "@/lib/questions";
import { getStepLabel, getPersonalizedPreviewLine } from "@/lib/personalization";
import { REPORT_PRICE_LABEL } from "@/lib/preview";
import { trackBeginCheckout, trackGenerateLead } from "@/lib/track";
import { computeLeakScores } from "@/lib/scoring";
import { computeFunnelHealthScore, getHealthScoreLabel } from "@/lib/health-score";
import { getStepMicroFeedback } from "@/lib/step-feedback";
import { BusinessTypeSelector } from "./BusinessTypeSelector";
import { QuestionField, validateQuestion } from "./QuestionField";
import { Button } from "./Button";
import { SeverityBar } from "./SeverityBar";
import { WizardSkeleton } from "@/components/WizardSkeleton";
import {
  clearWizardProgress,
  isValidEmail,
  loadWizardProgress,
  normalizeEmail,
  saveWizardProgress,
} from "@/lib/utils";

interface LossRange {
  low: number;
  high: number;
  label: string;
}

interface PreviewData {
  id: string;
  leakScores: Record<LeakCategory, number>;
  estimatedLosses: EstimatedLosses;
  healthScore: number;
  totalEstimatedLoss: number;
  lossRange: LossRange;
  topLeakCategory: LeakCategory | null;
  topLeakLabel: string | null;
  topLeakSeverity: number;
  isPaid: boolean;
}

type Phase = "select" | "questions" | "email" | "preview";

const WHAT_YOU_GET = [
  "Top 3 leaks ranked by estimated dollar impact",
  "Plain-English explanation of why each leak exists",
  "Effort-tagged fix-first recommendations (quick wins to strategic)",
  "30-day action plan and full breakdown across all 6 leak categories",
  "Permanent link emailed to you after checkout",
];

export function DiagnosticWizard() {
  const searchParams = useSearchParams();
  const cancelledDiagnosticId = searchParams.get("cancelled");
  const resumeDiagnosticId = searchParams.get("resume");
  const restoreDiagnosticId = cancelledDiagnosticId ?? resumeDiagnosticId;
  const restoreToken = searchParams.get("token");
  const isCheckoutCancel = Boolean(cancelledDiagnosticId);
  const wantsFreshStart = searchParams.get("fresh") === "1";

  const [phase, setPhase] = useState<Phase>("select");
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [personalizedLine, setPersonalizedLine] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const scrollToPreviewRef = useRef(false);
  const skipNextPersistRef = useRef(false);
  const skipStoredProgressRestoreRef = useRef(false);
  const activeDiagnosticIdRef = useRef<string | null>(null);
  const restoreGenerationRef = useRef(0);
  const [restoring, setRestoring] = useState(false);
  const [checkoutCancelled, setCheckoutCancelled] = useState(false);

  const steps = businessType ? getQuestionSteps(businessType) : [];
  const currentStep = steps[stepIndex] ?? [];
  const totalSteps = steps.length;
  const questionProgress =
    phase === "questions" ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  const liveHealthScore =
    phase === "questions" && businessType
      ? computeFunnelHealthScore(computeLeakScores(businessType, answers))
      : null;

  const stepFeedback =
    phase === "questions" && businessType
      ? getStepMicroFeedback(businessType, stepIndex, answers)
      : null;

  const applyPreviewData = useCallback(
    (
      data: Record<string, unknown>,
      type: BusinessType,
      savedAnswers: Answers
    ) => {
      const diagnosticId = data.id as string;
      activeDiagnosticIdRef.current = diagnosticId;
      setPreview({
        id: diagnosticId,
        leakScores: data.leakScores as Record<LeakCategory, number>,
        estimatedLosses: (data.estimatedLosses as EstimatedLosses) ?? {
          acquisition: 0,
          response: 0,
          conversion: 0,
          retention: 0,
          billing: 0,
          expansion: 0,
        },
        healthScore: (data.healthScore as number) ?? 0,
        totalEstimatedLoss: data.totalEstimatedLoss as number,
        lossRange: data.lossRange as LossRange,
        topLeakCategory: (data.topLeakCategory as LeakCategory | null) ?? null,
        topLeakLabel: (data.topLeakLabel as string | null) ?? null,
        topLeakSeverity: (data.topLeakSeverity as number) ?? 0,
        isPaid: Boolean(data.isPaid),
      });

      if (data.topLeakCategory) {
        setPersonalizedLine(
          getPersonalizedPreviewLine(type, savedAnswers, data.topLeakCategory as LeakCategory)
        );
      } else {
        setPersonalizedLine("");
      }

      if (typeof data.reportAccessToken === "string") {
        setAccessToken(data.reportAccessToken);
      } else if (typeof data.accessToken === "string") {
        setAccessToken(data.accessToken);
      }
    },
    []
  );

  async function loadDiagnosticFromApi(id: string, token: string) {
    const res = await fetch(
      `/api/diagnostic?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load diagnostic");
    return data as Record<string, unknown> & {
      businessType: BusinessType;
      answers?: Answers;
      email?: string | null;
      isPaid: boolean;
    };
  }

  const applyDiagnosticRestore = useCallback(
    (
      data: Record<string, unknown> & {
        businessType: BusinessType;
        answers?: Answers;
        email?: string | null;
      },
      fallbackAnswers: Answers = {}
    ) => {
      const type = data.businessType;
      const restoredAnswers = data.answers ?? fallbackAnswers;
      setBusinessType(type);
      setAnswers(restoredAnswers);
      setEmail(data.email ?? "");
      applyPreviewData(data, type, restoredAnswers);
    },
    [applyPreviewData]
  );

  function resetWizardState() {
    restoreGenerationRef.current += 1;
    skipNextPersistRef.current = true;
    skipStoredProgressRestoreRef.current = true;
    activeDiagnosticIdRef.current = null;
    clearWizardProgress();
    setRestoring(false);
    setPhase("select");
    setBusinessType(null);
    setAnswers({});
    setStepIndex(0);
    setErrors({});
    setPreview(null);
    setEmail("");
    setEmailError(null);
    setPersonalizedLine("");
    setError(null);
    setAccessToken(null);
    setCheckoutCancelled(false);
    scrollToPreviewRef.current = false;
  }

  function beginNewDiagnosticSession(type: BusinessType) {
    restoreGenerationRef.current += 1;
    skipNextPersistRef.current = true;
    skipStoredProgressRestoreRef.current = true;
    activeDiagnosticIdRef.current = null;
    clearWizardProgress();
    setRestoring(false);
    setBusinessType(type);
    setAnswers({});
    setStepIndex(0);
    setErrors({});
    setPhase("questions");
    setPreview(null);
    setPersonalizedLine("");
    setError(null);
    setEmail("");
    setEmailError(null);
    setAccessToken(null);
    setCheckoutCancelled(false);
    scrollToPreviewRef.current = false;
    saveWizardProgress({
      businessType: type,
      answers: {},
      stepIndex: 0,
      phase: "questions",
      email: "",
    });
  }

  useEffect(() => {
    let cancelled = false;
    const generation = restoreGenerationRef.current;

    function isStaleRestore() {
      return cancelled || generation !== restoreGenerationRef.current;
    }

    async function restoreProgress() {
      if (restoreDiagnosticId) {
        setRestoring(true);
        if (isCheckoutCancel) {
          setCheckoutCancelled(true);
        }
        try {
          const token =
            restoreToken ?? loadWizardProgress()?.diagnosticToken ?? null;
          if (!token) {
            throw new Error("Missing access token");
          }

          const data = await loadDiagnosticFromApi(restoreDiagnosticId, token);
          if (isStaleRestore()) return;

          if (data.isPaid) {
            const reportToken =
              (data.reportAccessToken as string | undefined) ?? token;
            window.location.href = `/result/${restoreDiagnosticId}?token=${encodeURIComponent(reportToken)}`;
            return;
          }

          applyDiagnosticRestore(data);
          setPhase("preview");
          scrollToPreviewRef.current = true;
          window.history.replaceState(null, "", "/#start");
        } catch {
          if (isStaleRestore()) return;
          activeDiagnosticIdRef.current = null;
          skipStoredProgressRestoreRef.current = true;
          setCheckoutCancelled(false);
          setPhase("select");
          setBusinessType(null);
          setPreview(null);
          clearWizardProgress();
          setError("We couldn't restore your preview. Please start a new diagnostic.");
        } finally {
          if (!isStaleRestore()) setRestoring(false);
        }
        return;
      }

      if (wantsFreshStart) {
        resetWizardState();
        window.history.replaceState(null, "", "/#start");
        return;
      }

      if (skipStoredProgressRestoreRef.current) {
        skipStoredProgressRestoreRef.current = false;
        return;
      }

      const saved = loadWizardProgress();
      if (!saved?.businessType) {
        return;
      }

      const savedPhase = (saved.phase as Phase) ?? "select";
      const savedType = saved.businessType as BusinessType;
      const savedAnswers = saved.answers ?? {};

      if (
        saved.diagnosticId &&
        (savedPhase === "preview" || savedPhase === "email")
      ) {
        setRestoring(true);
        try {
          const token = saved.diagnosticToken ?? null;
          if (!token) {
            throw new Error("Missing access token");
          }

          const data = await loadDiagnosticFromApi(saved.diagnosticId, token);
          if (isStaleRestore()) return;

          if (data.isPaid) {
            const reportToken =
              (data.reportAccessToken as string | undefined) ??
              (saved.diagnosticToken ?? null);
            if (reportToken) {
              window.location.href = `/result/${saved.diagnosticId}?token=${encodeURIComponent(reportToken)}`;
              return;
            }
            applyDiagnosticRestore(data, savedAnswers);
            setPhase("preview");
            return;
          }

          applyDiagnosticRestore(data, savedAnswers);
          setPhase(savedPhase);
        } catch {
          if (isStaleRestore()) return;
          activeDiagnosticIdRef.current = null;
          skipStoredProgressRestoreRef.current = true;
          setPhase("select");
          setBusinessType(null);
          setAnswers({});
          setStepIndex(0);
          setEmail("");
          setPreview(null);
          clearWizardProgress();
        } finally {
          if (!isStaleRestore()) setRestoring(false);
        }
        return;
      }

      if (isStaleRestore()) return;

      setBusinessType(savedType);
      setAnswers(savedAnswers);
      setStepIndex(saved.stepIndex ?? 0);
      setEmail(saved.email ?? "");

      if (savedPhase === "preview" || savedPhase === "email") {
        setPhase("select");
      } else {
        setPhase(savedPhase);
      }
    }

    restoreProgress();

    return () => {
      cancelled = true;
      setRestoring(false);
    };
  }, [restoreDiagnosticId, restoreToken, isCheckoutCancel, wantsFreshStart, applyDiagnosticRestore]);

  useEffect(() => {
    if (phase !== "preview" || !preview || !scrollToPreviewRef.current) return;
    scrollToPreviewRef.current = false;
    requestAnimationFrame(() => {
      document.getElementById("preview-results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [phase, preview]);

  useEffect(() => {
    if (restoring) return;
    if ((phase === "preview" || phase === "email") && !preview) {
      setPhase("select");
      setBusinessType(null);
      setAnswers({});
      setStepIndex(0);
      setEmail("");
      setPersonalizedLine("");
    }
  }, [restoring, phase, preview]);

  useEffect(() => {
    if (restoring) return;

    if (skipNextPersistRef.current) {
      if (
        (phase === "select" && !businessType && !preview) ||
        (phase === "questions" && businessType && !preview)
      ) {
        skipNextPersistRef.current = false;
      } else {
        return;
      }
    }

    if (!businessType && phase === "select") {
      clearWizardProgress();
      return;
    }

    const shouldPersistDiagnostic =
      (phase === "preview" || phase === "email") && Boolean(preview?.id);

    saveWizardProgress({
      businessType,
      answers,
      stepIndex,
      phase,
      email,
      diagnosticId: shouldPersistDiagnostic ? preview?.id : undefined,
      diagnosticToken: shouldPersistDiagnostic ? accessToken ?? undefined : undefined,
    });
  }, [restoring, businessType, answers, stepIndex, phase, email, preview, accessToken]);

  function handleStartOver() {
    resetWizardState();
    if (window.location.search || window.location.hash) {
      window.history.replaceState(null, "", "/#start");
    }
    document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSelectType(type: BusinessType) {
    beginNewDiagnosticSession(type);
  }

  function handleAnswerChange(id: string, value: string | number | boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    for (const q of currentStep) {
      const err = validateQuestion(q, answers);
      if (err) newErrors[q.id] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      submitDiagnostic();
    }
  }

  function handleBack() {
    if (phase === "email") {
      setPhase("questions");
      setStepIndex(totalSteps - 1);
      return;
    }
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      restoreGenerationRef.current += 1;
      skipNextPersistRef.current = true;
      skipStoredProgressRestoreRef.current = true;
      activeDiagnosticIdRef.current = null;
      clearWizardProgress();
      setRestoring(false);
      setPhase("select");
      setBusinessType(null);
      setPreview(null);
      setPersonalizedLine("");
      setAccessToken(null);
    }
  }

  async function submitDiagnostic() {
    if (!businessType) return;
    setLoading(true);
    setError(null);
    try {
      const existingId = activeDiagnosticIdRef.current;
      const token =
        accessToken ?? loadWizardProgress()?.diagnosticToken ?? undefined;
      const res = await fetch("/api/diagnostic", {
        method: existingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          existingId
            ? { id: existingId, businessType, answers, token }
            : { businessType, answers }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data.error ?? "Failed to save diagnostic");
      }

      applyPreviewData(data, businessType, answers);
      setPhase("email");
      document.getElementById("start")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailSubmit() {
    if (!preview) return;
    if (!email.trim() || !isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      return;
    }

    setLoading(true);
    setEmailError(null);
    setError(null);

    try {
      const token =
        accessToken ?? loadWizardProgress()?.diagnosticToken ?? undefined;
      const res = await fetch("/api/diagnostic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: preview.id,
          email: normalizeEmail(email),
          token,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data.error ?? "Failed to save email");
      }

      setPreview({
        id: data.id,
        leakScores: data.leakScores,
        estimatedLosses: data.estimatedLosses,
        healthScore: data.healthScore,
        totalEstimatedLoss: data.totalEstimatedLoss,
        lossRange: data.lossRange,
        topLeakCategory: data.topLeakCategory,
        topLeakLabel: data.topLeakLabel,
        topLeakSeverity: data.topLeakSeverity,
        isPaid: data.isPaid,
      });
      if (typeof data.reportAccessToken === "string") {
        setAccessToken(data.reportAccessToken);
      } else if (typeof data.accessToken === "string") {
        setAccessToken(data.accessToken);
      }

      setPhase("preview");
      scrollToPreviewRef.current = true;
      trackGenerateLead();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlock() {
    if (!preview) return;
    setCheckoutLoading(true);
    setError(null);
    try {
      const token =
        accessToken ?? loadWizardProgress()?.diagnosticToken ?? undefined;
      if (!token) {
        throw new Error("Session expired — refresh and try again.");
      }
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosticId: preview.id, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error(data.error ?? "Failed to start checkout");
      }
      trackBeginCheckout();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setCheckoutLoading(false);
    }
  }

  async function handleViewFullReport() {
    if (!preview) return;
    setError(null);

    const token = accessToken ?? loadWizardProgress()?.diagnosticToken ?? null;
    if (!token) {
      setError("Check your email for the report link, or complete checkout again.");
      return;
    }

    try {
      const data = await loadDiagnosticFromApi(preview.id, token);
      const reportToken =
        (data.reportAccessToken as string | undefined) ?? token;
      window.location.href = `/result/${preview.id}?token=${encodeURIComponent(reportToken)}`;
    } catch {
      setError("Could not load your report. Use the link from your email or try again.");
    }
  }

  if (restoring) {
    return <WizardSkeleton />;
  }

  if (phase === "preview" && preview) {
    return (
      <div className="space-y-8">
        {checkoutCancelled && !preview.isPaid && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Payment was cancelled. Your preview is still saved — unlock whenever you&apos;re ready.
          </div>
        )}

        <div
          id="preview-results"
          className="scroll-mt-24 rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
                Estimated monthly revenue loss
              </p>
              <p className="mt-2 text-4xl font-bold text-red-700 sm:text-5xl">
                {preview.lossRange.label}
                <span className="text-lg font-normal text-red-600/80"> /month</span>
              </p>
            </div>
            <div className="rounded-xl bg-white/90 px-4 py-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Funnel health
              </p>
              <p className="text-2xl font-bold text-brand-700">{preview.healthScore}/100</p>
              <p className="text-xs text-slate-600">{getHealthScoreLabel(preview.healthScore)}</p>
            </div>
          </div>
          {preview.topLeakLabel && (
            <div className="mt-4 rounded-lg bg-white/80 px-4 py-3">
              <p className="text-sm text-slate-600">
                Your #1 leak:{" "}
                <strong className="text-slate-900">{preview.topLeakLabel}</strong>
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                  {preview.topLeakSeverity}/100 severity
                </span>
              </p>
            </div>
          )}
          {personalizedLine && (
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{personalizedLine}</p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">All leak categories</p>
          {LEAK_CATEGORIES.map((cat) => (
            <SeverityBar
              key={cat}
              category={cat}
              severity={preview.leakScores[cat]}
              showAmount={cat !== preview.topLeakCategory}
              amount={preview.estimatedLosses[cat]}
              blurred={cat !== preview.topLeakCategory}
            />
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {preview.isPaid ? (
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900">Your full report is ready</h3>
            <p className="mt-2 text-slate-700">
              Payment complete — view your ranked leaks, dollar breakdown, and fix-first
              recommendations.
            </p>
            <Button size="lg" className="mt-6" onClick={handleViewFullReport}>
              View full report
            </Button>
            {email && (
              <p className="mt-4 text-xs text-slate-500">Report link emailed to {email}</p>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-accent-200 bg-accent-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900">
              Unlock your full fix-it report for {REPORT_PRICE_LABEL}
            </h3>
            <p className="mt-2 text-slate-700">
              You&apos;re leaking an estimated{" "}
              <strong>{preview.lossRange.label}/month</strong>. For a one-time{" "}
              <strong>{REPORT_PRICE_LABEL}</strong>, get the exact breakdown and what to fix first.
            </p>

            <ul className="mt-5 space-y-2">
              {WHAT_YOU_GET.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-brand-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full sm:w-auto"
              size="lg"
              variant="secondary"
              loading={checkoutLoading}
              onClick={handleUnlock}
            >
              Unlock full report — {REPORT_PRICE_LABEL}
            </Button>

            <div className="mt-4 space-y-1 text-xs text-slate-500">
              <p>Secure payment via Stripe · Instant access · 7-day money-back guarantee</p>
              <p>Report link will be emailed to {email}</p>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-slate-500">
          <button
            type="button"
            onClick={handleStartOver}
            className="text-brand-600 hover:underline"
          >
            Start over with a new diagnostic
          </button>
        </p>
      </div>
    );
  }

  if (phase === "email" && preview) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">Almost there — where should we send your results?</h2>
          <p className="mt-2 text-slate-600">
            Enter your email to see your revenue leak preview and get a permanent link to your report.
          </p>
        </div>

        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-slate-900">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
          <p className="mt-2 text-xs text-slate-500">
            We&apos;ll email your results link. See our{" "}
            <Link href="/privacy" className="text-brand-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleEmailSubmit} loading={loading}>
            See my results
          </Button>
        </div>

        <p className="text-center text-sm text-slate-500">
          <button
            type="button"
            onClick={handleStartOver}
            className="text-brand-600 hover:underline"
          >
            Start over with a new diagnostic
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && phase === "select" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {phase === "select" && (
        <div>
          <h2 className="text-xl font-semibold text-slate-900">What type of business are you?</h2>
          <p className="mt-1 text-slate-600">
            We&apos;ll tailor the diagnostic to your business model.
          </p>
          <div className="mt-6">
            <BusinessTypeSelector selected={businessType} onSelect={handleSelectType} />
          </div>
        </div>
      )}

      {phase === "questions" && businessType && (
        <div>
          <div className="sticky top-[65px] z-40 -mx-4 mb-6 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <p className="text-sm font-medium text-brand-600">
              {BUSINESS_TYPE_LABELS[businessType]} · Step {stepIndex + 1} of {totalSteps}:{" "}
              {getStepLabel(businessType, stepIndex)}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-600 transition-all duration-300"
                style={{ width: `${questionProgress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(questionProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {liveHealthScore !== null && stepIndex >= 1 && (
              <p className="mt-2 text-xs text-slate-600">
                Funnel health so far:{" "}
                <span className="font-semibold text-brand-700">{liveHealthScore}/100</span> (
                {getHealthScoreLabel(liveHealthScore)})
              </p>
            )}
          </div>

          {stepFeedback && (
            <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
              {stepFeedback}
            </div>
          )}

          <p className="mb-6 text-slate-600">
            Best estimates are fine — pick a range or tap &quot;Not sure&quot; if you&apos;re unsure.
          </p>

          <div className="space-y-6">
            {currentStep.map((q) => (
              <QuestionField
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={handleAnswerChange}
                error={errors[q.id]}
              />
            ))}
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleNext} loading={loading}>
              {stepIndex < totalSteps - 1 ? "Continue" : "Continue to results"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
