"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function GlassDaytimeSupportSection() {
  const [isDaytime, setIsDaytime] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      setIsDaytime(hours >= 6 && hours < 22);
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isDaytime) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 border border-white/80 dark:border-gray-700/80 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-6xl mb-6">☀️</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Start Your Day Right
            </h2>
            <div className="inline-block backdrop-blur-md bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-6 py-2 mb-6">
              <p className="text-white text-lg font-semibold">
                Local Time: {currentTime}
              </p>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Take a moment for your mental wellness. Whether you're dealing with work stress, 
              relationship challenges, or just need someone to talk to.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: "🌅", title: "Morning Sessions", desc: "Start fresh with clarity" },
                { icon: "☕", title: "Lunch Break Therapy", desc: "Quick 30-min sessions" },
                { icon: "🌆", title: "Evening Support", desc: "Unwind after work" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/psychologists"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Book a Session
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
