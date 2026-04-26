import Link from "next/link";

export function GlassHowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Browse Therapists",
      description: "Explore our diverse network of licensed professionals. Filter by language, specialization, and availability to find your perfect match.",
      icon: "🔍",
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      number: "02",
      title: "Book Your Session",
      description: "Choose a time that works for you. Secure your appointment instantly with our easy booking system, available 24/7.",
      icon: "📅",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      number: "03",
      title: "Connect & Heal",
      description: "Meet your therapist in a private, encrypted environment. Begin your personalized journey towards better mental well-being.",
      icon: "💚",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor your growth with clinical insights, goal tracking, and regular check-ins to ensure you're thriving.",
      icon: "📈",
      gradient: "from-amber-500/20 to-orange-500/20"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            How It 
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-3">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Your path to mental wellness in four simple, guided steps.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col h-full group"
              >
                {/* Connecting line for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 -translate-x-1/2 z-0" />
                )}

                <div className="flex-1 backdrop-blur-xl bg-white/40 dark:bg-gray-800/20 border border-white/60 dark:border-gray-700/30 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/60 dark:hover:bg-gray-800/40 relative z-10 flex flex-col h-full shadow-lg group-hover:border-indigo-500/30">
                  {/* Step number badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:rotate-12 transition-transform">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 font-black text-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon with glow */}
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500`}>
                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-5xl relative z-10">{step.icon}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Premium CTA Box */}
          {/* <div className="mt-24 text-center">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 border border-white/80 dark:border-gray-700/50 rounded-[2rem] p-10 md:p-14 max-w-4xl mx-auto shadow-2xl">
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
                  Ready to Start Your Journey?
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
                  Take the first step towards a healthier, happier you. Our expert therapists are here to guide you every step of the way.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/psychologists"
                    className="group/btn relative px-10 py-5 bg-indigo-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-xl hover:shadow-indigo-500/40 transition-all active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                    <span className="relative flex items-center justify-center gap-2">
                      Find Your Specialist
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    href="/faq"
                    className="px-10 py-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-full font-bold text-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition-all active:scale-95 shadow-lg"
                  >
                    View Pricing & FAQ
                  </Link>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

    </section>
  );
}
