import Link from "next/link";

export function GlassCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-teal-950 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-3xl p-10 md:p-14 text-center shadow-2xl">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Ready to Take the First Step?
              </h2>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Connect with a psychologist who understands your language and culture. Start your journey to better mental health today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 rounded-2xl p-4">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 dark:text-teal-400 mb-1">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
              </div>
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 rounded-2xl p-4">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
              </div>
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 rounded-2xl p-4">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Stories</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/psychologists"
                className="px-10 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full font-bold text-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Find Your Psychologist
              </Link>
              <Link 
                href="/services"
                className="px-10 py-4 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border-2 border-teal-500 dark:border-teal-400 text-teal-600 dark:text-teal-400 rounded-full font-bold text-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
              >
                Explore Services
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Licensed Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
