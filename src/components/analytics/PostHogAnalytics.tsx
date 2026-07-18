"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsentStatus,
  isCookieConsentStatus,
} from "@/lib/analytics/consent";
import { useAuth } from "@/lib/hooks/useAuth";
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
  const { user, userData } = useAuth();
  const [consent, setConsent] = useState<CookieConsentStatus | null>(null);
  const hasInitializedRef = useRef(false);

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
    if (!apiKey || hasInitializedRef.current) {
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: false,
      capture_pageleave: true,
      opt_out_capturing_by_default: true,
      persistence: "localStorage+cookie",
    });

    window.posthog = posthog as BrowserPostHog;
    hasInitializedRef.current = true;
  }, [apiHost, apiKey]);

  useEffect(() => {
    if (!apiKey || !hasInitializedRef.current) {
      return;
    }

    if (consent === "accepted") {
      posthog.opt_in_capturing();
      return;
    }

    if (consent === "rejected") {
      posthog.opt_out_capturing();
    }
  }, [apiKey, consent]);

  useEffect(() => {
    if (!apiKey || consent !== "accepted" || !hasInitializedRef.current) {
      return;
    }

    const currentUrl = window.location.href;

    posthog.capture("$pageview", {
      $current_url: currentUrl,
      path: pathname,
    });
  }, [apiKey, consent, pathname]);

  useEffect(() => {
    if (!apiKey || consent !== "accepted" || !hasInitializedRef.current) {
      return;
    }

    if (!user) {
      posthog.reset();
      return;
    }

    posthog.identify(user.uid, {
      email: user.email ?? userData?.email,
      role: userData?.role,
      user_status: userData?.status,
      display_name: userData?.profile.displayName,
      first_name: userData?.profile.firstName,
      last_name: userData?.profile.lastName,
      locale: userData?.profile.locale,
      timezone: userData?.profile.timezone,
      languages: userData?.profile.languages,
    });
  }, [apiKey, consent, user, userData]);

  return null;
}
