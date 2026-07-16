"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsentStatus,
  isCookieConsentStatus,
} from "@/lib/analytics/consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
}

function getStoredConsent(): CookieConsentStatus | null {
  const value = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return isCookieConsentStatus(value) ? value : null;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<CookieConsentStatus | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<CookieConsentStatus>;
      setConsent(customEvent.detail ?? getStoredConsent());
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!measurementId || consent !== "accepted" || !window.gtag) {
      return;
    }

    const pagePath = window.location.pathname + window.location.search;

    window.gtag("config", measurementId, {
      page_path: pagePath,
    });
  }, [consent, measurementId, pathname]);

  if (!measurementId || consent !== "accepted") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
