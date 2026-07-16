"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsentStatus,
  isCookieConsentStatus,
} from "@/lib/analytics/consent";

function persistConsent(status: CookieConsentStatus) {
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: status }));
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    setIsVisible(!isCookieConsentStatus(storedValue));
  }, []);

  const handleConsent = (status: CookieConsentStatus) => {
    persistConsent(status);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-emerald-100 bg-white/95 shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Cookie Preferences
          </p>
          <p className="text-sm leading-6 text-slate-700 sm:text-[15px]">
            We use essential cookies to keep the site working and optional
            analytics cookies to understand visits and improve MindGood. You can
            accept or decline analytics cookies at any time.
          </p>
          <p className="text-sm text-slate-500">
            Read more in our{" "}
            <Link href="/privacy" className="font-medium text-emerald-700 underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => handleConsent("rejected")}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Decline Analytics
          </button>
          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Accept Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

