import Link from "next/link";

export function GlassCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA Card */}
        <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-[3rem] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-teal-600/5"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-teal-600 mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Ready to Take the 
                <span className="block bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                  First Step?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Connect with a psychologist who understands your language and culture. Start your journey to better mental health today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-12 mb-12 max-w-4xl mx-auto">
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 hover:bg-white/60 transition-colors">
                <div className="text-3xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Languages</div>
              </div>
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 hover:bg-white/60 transition-colors">
                <div className="text-3xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Available Support</div>
              </div>
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/50 rounded-2xl p-6 hover:bg-white/60 transition-colors">
                <div className="text-3xl md:text-5xl font-bold text-teal-600 dark:text-teal-400 mb-2">1000+</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">Success Stories</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/psychologists"
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-full font-bold text-xl hover:from-purple-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Find Your Psychologist
              </Link>
              <Link 
                href="/services"
                className="px-12 py-5 backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full font-bold text-xl hover:bg-white/60 transition-all duration-300 hover:scale-105"
              >
                Explore Services
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-10 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap justify-center items-center gap-10 text-base text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Licensed Professionals</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">100% Confidential</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Secure Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
