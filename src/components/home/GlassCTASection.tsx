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
          <div className="backdrop-blur-3xl bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-[4rem] p-12 md:p-24 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            {/* Inner glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            
            <div className="relative z-10 text-center">
              {/* Icon / Brand Mark */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-10 shadow-lg group-hover:rotate-6 transition-transform duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
                Ready to Take the <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  First Step?
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
                Connect with a licensed psychologist who understands your language and culture. 
                Start your journey to better mental health today.
              </p>

              {/* Stats - Minimalist Row */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">50+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Languages</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Support</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">100%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Private</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  href="/psychologists"
                  className="px-12 py-5 bg-indigo-600 text-white rounded-full font-black text-xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
                >
                  Find Your Specialist
                </Link>
                <Link 
                  href="/services"
                  className="px-12 py-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-black text-xl hover:border-indigo-500 transition-all active:scale-95 shadow-lg"
                >
                  Explore Services
                </Link>
              </div>

              {/* Sub-Trust Badges */}
              <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
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
