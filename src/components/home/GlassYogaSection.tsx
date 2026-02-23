import Link from "next/link";

export function GlassYogaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 mb-6">
              <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Heal Your Mind Through Yoga
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ancient wisdom meets modern mental health. Discover how yoga can transform your emotional well-being, 
              reduce stress, and bring peace to your mind.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white/70 dark:hover:bg-gray-800/70">
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Reduce Anxiety & Stress</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Yoga activates your parasympathetic nervous system, lowering cortisol levels and calming racing thoughts. 
                Regular practice helps manage anxiety and chronic stress effectively.
              </p>
            </div>

            <div className="group backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white/70 dark:hover:bg-gray-800/70">
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Improve Mood & Sleep</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Boost serotonin and GABA levels naturally through yoga practice. Experience better sleep quality, 
                reduced depression symptoms, and enhanced overall emotional balance.
              </p>
            </div>

            <div className="group backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white/70 dark:hover:bg-gray-800/70">
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Build Mindfulness</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Develop present-moment awareness and emotional regulation. Yoga teaches you to observe thoughts 
                without judgment, creating mental clarity and inner peace.
              </p>
            </div>
          </div>

          {/* Science Section */}
          <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 md:p-10 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  The Science Behind Yoga & Mental Health
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Research shows that yoga significantly impacts brain chemistry and structure, offering 
                  therapeutic benefits comparable to traditional treatments for anxiety and depression.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Increases GABA levels by up to 27%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Reduces cortisol (stress hormone) levels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Enhances hippocampus volume (memory & emotion)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Improves heart rate variability (stress resilience)</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl backdrop-blur-md bg-gradient-to-br from-purple-200/50 to-indigo-200/50 dark:from-purple-900/30 dark:to-indigo-900/30 border border-white/40 dark:border-gray-700/40 flex items-center justify-center p-8">
                  <svg className="w-full h-full text-purple-600 dark:text-purple-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-600/90 via-indigo-600/90 to-violet-600/90 border border-white/20 rounded-3xl p-10 md:p-12 text-white text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Mental Health?
            </h3>
            <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto leading-relaxed">
              Join our online yoga sessions designed specifically for mental wellness. 
              Learn from experienced instructors who understand the mind-body connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/yoga-for-mental-health"
                className="px-10 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Explore Yoga Programs
              </Link>
              <Link 
                href="/psychologists"
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Combine with Therapy
              </Link>
            </div>
            <p className="mt-6 text-sm opacity-90">
              Beginner-Friendly • Live & Recorded Sessions • Mental Health Focused
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
