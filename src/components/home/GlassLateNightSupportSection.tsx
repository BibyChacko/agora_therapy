"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function GlassLateNightSupportSection() {
  const [isLateNight, setIsLateNight] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      setIsLateNight(hours >= 22 || hours < 6);
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

  if (!isLateNight) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Starry background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12">
            <div className="text-6xl mb-6">🌙</div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Can't Sleep? We're Here.
            </h2>
            <div className="inline-block backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-6 py-2 mb-6">
              <p className="text-white text-lg font-semibold">
                Local Time: {currentTime}
              </p>
            </div>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Late-night thoughts keeping you awake? You're not alone. 
              Our therapists are available 24/7 to support you through difficult moments.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { icon: "💬", title: "Instant Chat", desc: "Text with a therapist now" },
                { icon: "📞", title: "Crisis Line", desc: "Immediate phone support" },
                { icon: "📹", title: "Video Session", desc: "Face-to-face connection" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/psychologists"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Connect Now
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
