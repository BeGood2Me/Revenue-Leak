export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function parseFormattedNumber(value: string): number | "" {
  const cleaned = value.replace(/,/g, "").trim();
  if (cleaned === "") return "";
  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? "" : parsed;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

const STORAGE_KEY = "rlr-wizard-progress";

export interface WizardProgress {
  businessType: string | null;
  answers: Record<string, string | number | boolean>;
  stepIndex: number;
  phase: string;
  email?: string;
  diagnosticId?: string;
  diagnosticToken?: string;
}

export function loadWizardProgress(): WizardProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WizardProgress) : null;
  } catch {
    return null;
  }
}

export function saveWizardProgress(progress: WizardProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota errors
  }
}

export function clearWizardProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
