"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type AnimationPhase = 'from' | 'to' | 'complete';

export function GlassEmotionalJourneySection() {
  const fears = [
    { from: "Scared of nights", to: "Scared of being a failure" },
    { from: "Scared of ghosts", to: "Scared of being a burden" },
    { from: "Scared of the dark", to: "Scared of not being enough" },
    { from: "Scared of monsters", to: "Scared of being misunderstood" },
    { from: "Scared of being alone", to: "Scared of being unloved" },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<AnimationPhase>('from');
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Intersection Observer to detect when section is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  // Animation logic - only runs when section is visible
  useEffect(() => {
    if (!isVisible || showFinalMessage) return;

    const timer = setTimeout(() => {
      if (phase === 'from') {
        // Show the "to" text after 1s
        setPhase('to');
      } else if (phase === 'to') {
        // Move to next fear or show final message
        if (currentIndex < fears.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setPhase('from');
        } else {
          setPhase('complete');
          setTimeout(() => setShowFinalMessage(true), 1000);
        }
      }
    }, 1000); // 1s delay

    return () => clearTimeout(timer);
  }, [currentIndex, phase, showFinalMessage, fears.length, isVisible]);

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden bg-black">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/20 via-black to-purple-950/20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto min-h-[70vh] flex items-center justify-center">
          {!showFinalMessage ? (
            <div className="w-full">
              {/* Step indicator */}
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-full border-2 border-teal-400 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="h-px w-8 bg-white/20"></div>
                <span className="text-white/40 text-sm font-mono">0{currentIndex + 1}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-light text-white/60 mb-8">
                Your Fears Have Grown Up With You
              </h2>
              
              {/* Sequential Text Animation */}
              <div className="min-h-[250px] flex items-start justify-start">
                <div className="space-y-8 w-full">
                  {/* "From" Text */}
                  <div className={`transition-all duration-700 ${phase === 'from' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <p className="text-4xl md:text-5xl lg:text-6xl text-white font-light">
                      {fears[currentIndex].from}
                    </p>
                  </div>

                  {/* "To" Text */}
                  {phase === 'to' && (
                    <div className="animate-fade-in-up border-l-2 border-teal-400 pl-6">
                      <p className="text-base md:text-lg text-white/50 mb-3">transforms into</p>
                      <p className="text-4xl md:text-5xl lg:text-6xl text-white font-light">
                        {fears[currentIndex].to}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2 mt-12">
                {fears.map((_, index) => (
                  <div
                    key={index}
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      index <= currentIndex 
                        ? 'w-12 bg-teal-400' 
                        : 'w-12 bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Final Warm Message */
            <div className="w-full animate-fade-in-up">
              <div className="border-l-2 border-teal-400 pl-6 md:pl-8">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 animate-fade-in-up">
                  We Are Here With You
                </h3>
                <p className="text-lg md:text-xl text-white/60 mb-12 leading-relaxed max-w-2xl animate-fade-in-up delay-300">
                  Hugging you tightly. Being with you. Hearing you. 
                  <br className="hidden md:block" />
                  You don&apos;t have to carry it all alone anymore.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-500">
                  <Link 
                    href="/psychologists"
                    className="px-8 py-4 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-400 transition-all duration-300 hover:scale-105"
                  >
                    Talk to Someone Today
                  </Link>
                  <Link 
                    href="/services"
                    className="px-8 py-4 border border-white/20 text-white rounded-full font-medium hover:bg-white/5 transition-all duration-300 hover:scale-105"
                  >
                    Explore Support Options
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
