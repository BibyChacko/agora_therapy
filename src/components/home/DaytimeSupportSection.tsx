"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LocalTimeDisplay } from "./LocalTimeDisplay";

export function DaytimeSupportSection() {
  const [shouldShow, setShouldShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      // Show during daytime: 5:30 AM to 10:30 PM
      const nightStart = 22 * 60 + 30; // 1350
      const nightEnd = 5 * 60 + 30;    // 330
      
      // Show if time is between 5:30 AM and 10:30 PM
      const isDaytime = totalMinutes > nightEnd && totalMinutes < nightStart;
      setShouldShow(isDaytime);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || !shouldShow) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-orange-950 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-200 dark:bg-amber-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-200 dark:bg-orange-900 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-yellow-200 dark:bg-yellow-900 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto mb-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Feeling Overwhelmed? Take a Moment for Yourself
          </h2>

          <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            It&apos;s <LocalTimeDisplay />. The day is in full swing, but that doesn&apos;t mean you have to face it alone.
            <br className="hidden md:block" />
            Your mental health matters—even in the middle of a busy day.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 mb-10 border border-amber-200 dark:border-gray-700 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Therapists Online Now</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Quick Response</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Same-Day Sessions</span>
              </div>
            </div>

            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6">
              Whether you&apos;re dealing with work stress, relationship challenges, or just need someone to talk to—
              our therapists are available right now. No waiting, no judgment, just support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/psychologists"
                className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                Connect with a Therapist
              </Link>
              <Link 
                href="/services"
                className="px-10 py-4 border-2 border-amber-600 text-amber-700 dark:text-amber-400 dark:border-amber-500 rounded-full font-bold text-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                Browse Services
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-amber-100 dark:border-gray-700 shadow-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Work Stress</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Career & workplace support</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-amber-100 dark:border-gray-700 shadow-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Relationships</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Family & partner counseling</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-amber-100 dark:border-gray-700 shadow-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Anxiety</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stress & anxiety management</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Taking a break to prioritize your mental health isn&apos;t a luxury—it&apos;s essential. 
            Whether you have 15 minutes or an hour, we&apos;re here to support you.
          </p>
        </div>
      </div>
    </section>
  );
}
