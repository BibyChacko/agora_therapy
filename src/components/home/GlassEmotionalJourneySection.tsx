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
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Fears Have Grown Up With You
            </h2>
            <div className="space-y-4">
              {fears.map((fear, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <span className="text-white/70 text-lg">{fear.from}</span>
                    <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-white font-semibold text-lg">{fear.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              We Are Here With You
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
              Hugging you tightly. Being with you. Hearing you. 
              <br className="hidden md:block" />
              You don&apos;t have to carry it all alone anymore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                href="/psychologists"
                className="px-8 py-3 bg-white text-teal-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Talk to Someone Today
              </Link>
              <Link 
                href="/services"
                className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
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
