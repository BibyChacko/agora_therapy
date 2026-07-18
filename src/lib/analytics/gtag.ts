import {
  COOKIE_CONSENT_STORAGE_KEY,
  isCookieConsentStatus,
} from "@/lib/analytics/consent";
import type { BrowserPostHog } from "@/lib/analytics/posthog";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: BrowserPostHog;
  }
}

type AnalyticsValue =
  | string
  | number
  | boolean
  | undefined
  | AnalyticsValue[]
  | { [key: string]: AnalyticsValue };

type AnalyticsParams = Record<string, AnalyticsValue>;

type Item = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_category2?: string;
  price?: number;
  quantity?: number;
};

function canTrack() {
  if (typeof window === "undefined") {
    return false;
  }

  const storedConsent = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  const hasConsent =
    isCookieConsentStatus(storedConsent) && storedConsent === "accepted";

  if (!hasConsent) {
    return false;
  }

  return (
    typeof window.gtag === "function" ||
    typeof window.posthog?.capture === "function"
  );
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (!canTrack()) {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  if (typeof window.posthog?.capture === "function") {
    window.posthog.capture(name, params);
  }
}

export function trackLogin(method: "email" | "google", role?: string) {
  trackEvent("login", {
    method,
    user_role: role,
  });
}

export function trackSignUp(method: "email" | "google", role?: string) {
  trackEvent("sign_up", {
    method,
    user_role: role,
  });
}

export function trackGenerateLead(params: {
  form_name: string;
  subject?: string;
  preferred_language?: string;
}) {
  trackEvent("generate_lead", params);
}

export function trackViewItem(params: {
  currency: string;
  value: number;
  items: Item[];
}) {
  trackEvent("view_item", params);
}

export function trackSelectItem(params: {
  item_list_name: string;
  items: Item[];
}) {
  trackEvent("select_item", params);
}

export function trackBeginCheckout(params: {
  currency: string;
  value: number;
  items: Item[];
}) {
  trackEvent("begin_checkout", params);
}

export function trackAddPaymentInfo(params: {
  currency: string;
  value: number;
  payment_type: string;
  items: Item[];
}) {
  trackEvent("add_payment_info", params);
}

export function trackPurchase(params: {
  transaction_id: string;
  currency: string;
  value: number;
  items: Item[];
}) {
  trackEvent("purchase", params);
}

export function trackException(description: string, fatal = false) {
  trackEvent("exception", {
    description,
    fatal,
  });
}

export function trackTherapistFilters(params: {
  event_source: "page_load" | "filter_change" | "reset";
  language_code?: string;
  language_name?: string;
  specialization_id?: string;
  specialization_name?: string;
  min_experience?: string;
  location?: string;
}) {
  trackEvent("therapist_filters_applied", params);
}

export function trackServiceSearch(params: {
  query: string;
  result_count?: number;
  event_source: "submit" | "page_load";
}) {
  trackEvent("services_search", params);
}

export function trackServiceClick(params: {
  service_id?: string;
  service_name?: string;
  click_target:
    | "service_specialists_cta"
    | "related_therapist"
    | "featured_topic"
    | "empty_state"
    | "bottom_cta";
  therapist_id?: string;
  therapist_name?: string;
  query?: string;
}) {
  trackEvent("services_click", params);
}

export function trackLanguageDiscovery(params: {
  click_target: "region_tab" | "language_card" | "view_all_languages" | "browse_all_languages";
  region?: string;
  language_code?: string;
  language_name?: string;
  visible_language_count?: number;
  total_language_count?: number;
}) {
  trackEvent("language_discovery", params);
}
