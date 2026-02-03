import Link from "next/link";

export function GlassSexualHealthSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-rose-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative order-2 lg:order-1">
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] relative">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop"
                    alt="Sexual Health Support"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-rose-900/40 to-transparent"></div>
                  
                  {/* Stats overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl p-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white text-2xl font-bold">100%</p>
                          <p className="text-white/80 text-sm">Confidential</p>
                        </div>
                        <div>
                          <p className="text-white text-2xl font-bold">Safe</p>
                          <p className="text-white/80 text-sm">Judgment-Free</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Sexual Health &
                <span className="block bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Intimacy Support
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                A safe, confidential space to discuss sexual health, intimacy concerns, 
                and relationship dynamics with specialized therapists who understand.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Sexual dysfunction and concerns",
                  "Intimacy and relationship issues",
                  "LGBTQ+ affirming therapy",
                  "Trauma-informed sexual health care",
                  "Communication about intimacy",
                  "Body image and self-esteem"
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-xl p-4 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/sexual-health-support"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full font-semibold hover:from-rose-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Learn More
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
