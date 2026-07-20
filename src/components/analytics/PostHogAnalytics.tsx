"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsentStatus,
  isCookieConsentStatus,
} from "@/lib/analytics/consent";
import type { BrowserPostHog } from "@/lib/analytics/posthog";

declare global {
  interface Window {
    posthog?: BrowserPostHog;
  }
}

interface PostHogAnalyticsProps {
  apiKey?: string;
  apiHost?: string;
}

function getStoredConsent(): CookieConsentStatus | null {
  const value = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return isCookieConsentStatus(value) ? value : null;
}

export function PostHogAnalytics({
  apiKey,
  apiHost,
}: PostHogAnalyticsProps) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<CookieConsentStatus | null>(null);
  const hasInitializedRef = useRef(false);
  const posthogRef = useRef<BrowserPostHog | null>(null);

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
    if (
      !apiKey ||
      consent !== "accepted" ||
      hasInitializedRef.current
    ) {
      return;
    }

    let isMounted = true;

    const initializePostHog = async () => {
      const posthogModule = await import("posthog-js");
      const posthog = posthogModule.default;

      if (!isMounted) {
        return;
      }

      posthog.init(apiKey, {
        api_host: apiHost,
        capture_pageview: false,
        capture_pageleave: true,
        persistence: "localStorage+cookie",
      });

      posthogRef.current = posthog as BrowserPostHog;
      window.posthog = posthog as BrowserPostHog;
      hasInitializedRef.current = true;
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        path: window.location.pathname,
      });
    };

    initializePostHog();

    return () => {
      isMounted = false;
    };
  }, [apiHost, apiKey, consent]);

  useEffect(() => {
    if (!apiKey || !hasInitializedRef.current) {
      return;
    }

    if (consent === "rejected") {
      posthogRef.current?.opt_out_capturing();
    }
  }, [apiKey, consent]);

  useEffect(() => {
    if (!apiKey || consent !== "accepted" || !hasInitializedRef.current) {
      return;
    }

    const currentUrl = window.location.href;

    posthogRef.current?.capture("$pageview", {
      $current_url: currentUrl,
      path: pathname,
    });
  }, [apiKey, consent, pathname]);

  return null;
}
