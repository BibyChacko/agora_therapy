import Link from "next/link";

export function GlassHowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Browse Therapists",
      description: "Explore our diverse network of licensed professionals. Filter by language, specialization, and availability.",
      icon: "🔍"
    },
    {
      number: "02",
      title: "Book Your Session",
      description: "Choose a time that works for you. Sessions available 24/7 via video, phone, or chat.",
      icon: "📅"
    },
    {
      number: "03",
      title: "Connect & Heal",
      description: "Meet your therapist in a secure, confidential environment. Start your journey to better mental health.",
      icon: "💚"
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor your growth with session notes, goals, and personalized insights from your therapist.",
      icon: "📈"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It 
            <span className="bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent ml-2">
              Works
            </span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Getting started with online therapy is simple. Follow these easy steps to begin your journey.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Connecting line (hidden on mobile, shown on larger screens) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-teal-300 dark:from-purple-700 dark:to-teal-700 -translate-x-1/2 z-0"></div>
                )}

                <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white/60 dark:hover:bg-gray-800/60 relative z-10">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900 dark:to-teal-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">{step.icon}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 rounded-3xl p-8 max-w-3xl mx-auto relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-teal-500/5"></div>
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
                  Join thousands who have found support and healing through our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/psychologists"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    Browse Therapists
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 px-8 py-4 backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full font-semibold hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:scale-105"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
