import Link from "next/link";

export function GlassHeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* 24/7 Badge */}
            <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/90 dark:border-gray-700/90 rounded-full px-4 py-2 shadow-lg w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">24/7</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Available Support</p>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Your Life For Greater
              <span className="block bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </h1>

            {/* Feature Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  title: "Expert Therapists",
                  description: "Connect with licensed professionals in 50+ languages"
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: "Transformative Power of Therapy",
                  description: "Evidence-based approaches tailored to your unique needs"
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: "Welcoming Community",
                  description: "Join thousands finding support and healing together"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-2xl p-5 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Video/Image Card */}
          <div className="relative">
            <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/5] relative">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1000&fit=crop"
                  alt="Mental Health Professional"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Bottom info card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold text-lg">View Patient Stories</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 border-2 border-white"></div>
                            ))}
                          </div>
                          <span className="text-white/90 text-sm">1000+ Success Stories</span>
                        </div>
                      </div>
                      <button className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

    
          </div>
        </div>
      </div>
    </section>
  );
}
