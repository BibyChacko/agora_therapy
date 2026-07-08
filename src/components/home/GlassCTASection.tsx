import Link from "next/link";

export function GlassCTASection() {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Premium Gradient Background - Full Width */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#e0e7ff,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_120%,#fae8ff,transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_120%,#2e1065,transparent_50%)]"></div>
        <div className="absolute top-1/2 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_50%,#f0fdfa,transparent_50%)] dark:bg-[radial-gradient(circle_at_0%_50%,#064e3b,transparent_50%)]"></div>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-3xl bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 md:rounded-[4rem] md:p-24 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            
            <div className="relative z-10 text-center">
              {/* Icon / Brand Mark */}
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg transition-transform duration-500 group-hover:rotate-6 sm:mb-10 sm:h-20 sm:w-20 sm:rounded-3xl">
                <svg className="h-7 w-7 text-white sm:h-10 sm:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h2 className="mb-5 text-3xl font-black leading-tight tracking-tight text-gray-900 dark:text-white sm:mb-8 sm:text-4xl md:text-6xl lg:text-7xl">
                Ready to Take the <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  First Step?
                </span>
              </h2>

              <p className="mx-auto mb-8 max-w-3xl text-base font-medium leading-relaxed text-gray-600 dark:text-gray-300 sm:mb-12 sm:text-xl md:text-2xl">
                Connect with a licensed psychologist who understands your language and culture. 
                Start your journey to better mental health today.
              </p>

              {/* Stats - Minimalist Row */}
              <div className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-4 sm:mb-16 sm:gap-8 md:gap-16">
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl md:text-4xl">50+</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 sm:text-sm sm:tracking-widest">Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl md:text-4xl">24/7</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 sm:text-sm sm:tracking-widest">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl md:text-4xl">100%</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400 sm:text-sm sm:tracking-widest">Private</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
                <Link 
                  href="/psychologists"
                  className="w-full max-w-[260px] rounded-full bg-indigo-600 px-6 py-3 text-center text-base font-black text-white transition-all active:scale-95 hover:bg-indigo-700 hover:scale-105 sm:w-auto sm:max-w-none sm:px-12 sm:py-5 sm:text-xl"
                >
                  Find Your Specialist
                </Link>
                <Link 
                  href="/services"
                  className="w-full max-w-[260px] rounded-full border-2 border-gray-100 bg-white px-6 py-3 text-center text-base font-black text-gray-900 transition-all active:scale-95 hover:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-auto sm:max-w-none sm:px-12 sm:py-5 sm:text-xl"
                >
                  Explore Services
                </Link>
              </div>

              {/* Sub-Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 sm:mt-16 sm:gap-8 sm:text-sm sm:tracking-[0.2em]">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  Licensed
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  Secure
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                  Confidential
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
