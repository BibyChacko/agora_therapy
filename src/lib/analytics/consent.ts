export const COOKIE_CONSENT_STORAGE_KEY = "mindgood-cookie-consent";
export const COOKIE_CONSENT_EVENT = "mindgood-cookie-consent-change";

export type CookieConsentStatus = "accepted" | "rejected";

export function isCookieConsentStatus(
  value: string | null
): value is CookieConsentStatus {
  return value === "accepted" || value === "rejected";
}

