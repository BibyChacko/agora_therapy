import Link from "next/link";

export function GlassEmotionalJourneySection() {
  const fears = [
    { from: "Scared of nights", to: "Scared of being a failure" },
    { from: "Scared of ghosts", to: "Scared of being a burden" },
    { from: "Scared of the dark", to: "Scared of not being enough" },
    { from: "Scared of monsters", to: "Scared of being misunderstood" },
    { from: "Scared of being alone", to: "Scared of being unloved" },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1920&h=800&fit=crop"
          alt="Emotional Journey"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/80 to-purple-900/90"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 text-center">
              Your Fears Have Grown Up With You
            </h2>
            <div className="space-y-3">
              {fears.map((fear, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-5 md:p-6 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-white/60 text-base md:text-lg flex-1 text-left">
                      {fear.from}
                    </span>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-white font-semibold text-base md:text-lg flex-1 text-right">
                      {fear.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
              We Are Here With You
            </h3>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              Hugging you tightly. Being with you. Hearing you. 
              <br className="hidden md:block" />
              You don&apos;t have to carry it all alone anymore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/psychologists"
                className="px-8 py-4 bg-white text-teal-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Talk to Someone Today
              </Link>
              <Link 
                href="/services"
                className="px-8 py-4 backdrop-blur-md bg-white/10 border-2 border-white/40 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                Explore Support Options
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
