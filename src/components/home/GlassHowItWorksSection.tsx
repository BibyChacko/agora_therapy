export function GlassHowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Browse Therapists",
      description: "Explore our diverse network of licensed professionals. Filter by language, specialization, and availability to find your perfect match.",
      icon: "🔍",
      gradient: "from-sky-500/20 to-cyan-500/20"
    },
    {
      number: "02",
      title: "Book Your Session",
      description: "Choose a time that works for you. Secure your appointment instantly with our easy booking system, available 24/7.",
      icon: "📅",
      gradient: "from-rose-500/20 to-orange-500/20"
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
    <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-sky-50/40 to-teal-50/30 py-16 md:py-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Dynamic background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 h-[420px] w-[420px] rounded-full bg-sky-200/20 blur-[120px] animate-pulse md:h-[500px] md:w-[500px]"></div>
        <div className="absolute bottom-1/4 -right-20 h-[420px] w-[420px] rounded-full bg-teal-200/20 blur-[120px] animate-pulse delay-1000 md:h-[500px] md:w-[500px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-10 text-center md:mb-20">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-gray-900 dark:text-white md:mb-6 md:text-5xl lg:text-6xl">
            How It 
            <span className="ml-2 text-teal-700 dark:text-teal-300 md:ml-3">
              Works
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base font-medium text-gray-600 dark:text-gray-400 md:text-xl">
            Your path to mental wellness in four simple, guided steps.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex h-full flex-col group"
              >
                {/* Connecting line for Desktop */}
                {index < steps.length - 1 && (
                  <div className="absolute left-7 top-full z-0 h-8 w-px -translate-y-2 bg-gradient-to-b from-sky-200 to-teal-200 dark:from-sky-900 dark:to-teal-900 md:hidden" />
                )}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full h-px w-full -translate-x-1/2 z-0 bg-gradient-to-r from-sky-200 to-teal-200 dark:from-sky-900 dark:to-teal-900" />
                )}

                <div className="relative z-10 flex h-full flex-1 flex-row gap-4 rounded-[2rem] border border-white/60 bg-white/50 p-5 shadow-lg backdrop-blur-xl transition-all duration-500 group-hover:border-teal-500/30 group-hover:bg-white/70 group-hover:shadow-2xl dark:border-gray-700/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/40 md:rounded-[2.25rem] md:p-6 lg:flex-col lg:gap-0 lg:rounded-[2.5rem] lg:p-8 lg:hover:-translate-y-2">
                  {/* Step number badge */}
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-lg transition-transform group-hover:rotate-6 dark:border-gray-700 dark:bg-gray-800 md:h-11 md:w-11 lg:-right-4 lg:-top-4 lg:h-12 lg:w-12 lg:shadow-xl lg:group-hover:rotate-12">
                    <span className="text-base font-black text-teal-700 dark:text-teal-300 lg:text-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon with glow */}
                  <div className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} transition-transform duration-500 group-hover:scale-105 md:h-16 md:w-16 md:rounded-[1.4rem] lg:mb-8 lg:h-20 lg:w-20 lg:rounded-3xl lg:group-hover:scale-110`}>
                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 text-3xl md:text-4xl lg:text-5xl">{step.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 lg:min-w-full">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300 md:mb-3 md:text-2xl lg:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium leading-6 text-gray-600 dark:text-gray-400 md:text-base md:leading-7">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
