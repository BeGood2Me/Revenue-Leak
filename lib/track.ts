import { GOOGLE_ADS_SEND_TO, META_PIXEL_ID } from "@/lib/analytics-config";
import { REPORT_PRICE_CENTS } from "@/lib/preview";

const PURCHASE_VALUE = REPORT_PRICE_CENTS / 100;
const REPORT_ITEM = {
  item_name: "Full Revenue Leak Report",
  price: PURCHASE_VALUE,
  quantity: 1,
};

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  (window as GtagWindow).gtag?.(...args);
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  (window as GtagWindow).fbq?.(...args);
}

export function trackGenerateLead() {
  gtag("event", "generate_lead", {
    currency: "USD",
    value: PURCHASE_VALUE,
  });
  fbq("track", "Lead", { currency: "USD", value: PURCHASE_VALUE });
}

export function trackBeginCheckout() {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: PURCHASE_VALUE,
    items: [REPORT_ITEM],
  });
  fbq("track", "InitiateCheckout", {
    currency: "USD",
    value: PURCHASE_VALUE,
    content_name: REPORT_ITEM.item_name,
  });
}

export function trackPurchase(transactionId: string) {
  gtag("event", "purchase", {
    transaction_id: transactionId,
    currency: "USD",
    value: PURCHASE_VALUE,
    items: [REPORT_ITEM],
  });

  if (GOOGLE_ADS_SEND_TO) {
    gtag("event", "conversion", {
      send_to: GOOGLE_ADS_SEND_TO,
      transaction_id: transactionId,
      value: PURCHASE_VALUE,
      currency: "USD",
    });
  }

  fbq("track", "Purchase", {
    currency: "USD",
    value: PURCHASE_VALUE,
    content_name: REPORT_ITEM.item_name,
  });
}

const PURCHASE_TRACKED_PREFIX = "rl_purchase_tracked_";

export function hasTrackedPurchase(transactionId: string): boolean {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem(`${PURCHASE_TRACKED_PREFIX}${transactionId}`) === "1";
}

export function markPurchaseTracked(transactionId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PURCHASE_TRACKED_PREFIX}${transactionId}`, "1");
}
