import Link from "next/link";

export function GlassSupportHandSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              A Helping Hand
              <span className="block bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                When You Need It Most
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Life can feel overwhelming. Whether you're dealing with stress, anxiety, depression, 
              or just need someone to talk to, we're here to support you every step of the way.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: "🌙", title: "Crisis Support", desc: "Immediate help when you need it most" },
                { icon: "🧘", title: "Stress Management", desc: "Learn coping strategies that work" },
                { icon: "💭", title: "Anxiety Relief", desc: "Overcome worry and find peace" },
                { icon: "🌻", title: "Depression Care", desc: "Professional support for healing" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-2xl p-5 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/psychologists"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Get Support Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-square relative">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=800&fit=crop"
                  alt="Support"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Overlay quote */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl p-6">
                    <p className="text-white text-lg font-semibold mb-2">
                      "You don't have to face this alone."
                    </p>
                    <p className="text-white/80 text-sm">
                      Compassionate care from licensed professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
