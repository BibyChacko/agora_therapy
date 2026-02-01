"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LocalTimeDisplay } from "./LocalTimeDisplay";

export function LateNightSupportSection() {
  const [shouldShow, setShouldShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      // 10:30 PM = 22:30 = 1350 minutes
      // 5:30 AM = 5:30 = 330 minutes
      const nightStart = 22 * 60 + 30; // 1350
      const nightEnd = 5 * 60 + 30;    // 330
      
      // Show if time is after 10:30 PM OR before 5:30 AM
      const isNightTime = totalMinutes >= nightStart || totalMinutes <= nightEnd;
      setShouldShow(isNightTime);
    };

    checkTime();
    // Check every minute
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Don't render anything during SSR or if not night time
  if (!mounted || !shouldShow) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-pink-300 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <svg className="w-20 h-20 mx-auto mb-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Can&apos;t Sleep? We&apos;re Awake Too
          </h2>

          <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">
            It&apos;s <LocalTimeDisplay />. The world is quiet, but your mind isn&apos;t. 
            <br className="hidden md:block" />
            You don&apos;t have to face the darkness alone.
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 mb-10 border border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">Available Now</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/30"></div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-semibold">24/7 Support</span>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/30"></div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="text-lg font-semibold">Instant Connect</span>
              </div>
            </div>

            <p className="text-base md:text-lg opacity-90 mb-6">
              Our therapists are online right now, ready to listen. No appointments needed. 
              No waiting. Just someone who cares, whenever you need them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/psychologists"
                className="px-10 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Talk to Someone Now
              </Link>
              <Link 
                href="/services"
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Learn About Our Services
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-sm opacity-90">Licensed Therapists</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-90">Languages Supported</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Always Available</div>
            </div>
          </div>

          <p className="mt-10 text-sm opacity-75 max-w-2xl mx-auto">
            Whether it&apos;s anxiety keeping you up, thoughts racing through your mind, or you just need someone to talk to—
            we&apos;re here. Day or night. Anywhere in the world.
          </p>
        </div>
      </div>
    </section>
  );
}
