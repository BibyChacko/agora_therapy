import Link from "next/link";

export function YogaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-10 left-20 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-300 dark:bg-violet-900 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <svg className="w-20 h-20 text-purple-600 dark:text-purple-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-purple-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Reduce Anxiety & Stress</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Yoga activates your parasympathetic nervous system, lowering cortisol levels and calming racing thoughts. 
                Regular practice helps manage anxiety and chronic stress effectively.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-indigo-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Improve Mood & Sleep</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Boost serotonin and GABA levels naturally through yoga practice. Experience better sleep quality, 
                reduced depression symptoms, and enhanced overall emotional balance.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-violet-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 mb-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Build Mindfulness</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Develop present-moment awareness and emotional regulation. Yoga teaches you to observe thoughts 
                without judgment, creating mental clarity and inner peace.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 rounded-2xl p-1 mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 md:p-10">
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
                      <span className="text-sm text-gray-600 dark:text-gray-400">Increases GABA levels by up to 27%</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Reduces cortisol (stress hormone) levels</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Enhances hippocampus volume (memory & emotion)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Improves heart rate variability (stress resilience)</span>
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center p-8">
                    <svg className="w-full h-full text-purple-600 dark:text-purple-400 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-10 md:p-12 text-white text-center shadow-2xl">
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
                className="px-10 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Explore Yoga Programs
              </Link>
              <Link 
                href="/psychologists"
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
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
