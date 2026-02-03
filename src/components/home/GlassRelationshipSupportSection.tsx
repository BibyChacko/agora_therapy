import Link from "next/link";

export function GlassRelationshipSupportSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-pink-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left - Image */}
          <div className="relative">
            <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <img
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop"
                  alt="Relationship Support"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
            </div>
            
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/90 dark:border-gray-700/90 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5000+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Couples Helped</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Strengthen Your
              <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Relationships
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Whether you're navigating challenges in your romantic relationship, family dynamics, 
              or friendships, our experienced therapists provide compassionate support.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: "💑", title: "Couples Counseling", desc: "Rebuild trust and communication" },
                { icon: "👨‍👩‍👧‍👦", title: "Family Therapy", desc: "Heal family relationships" },
                { icon: "🤝", title: "Communication Skills", desc: "Learn healthy dialogue patterns" },
                { icon: "💔", title: "Breakup Support", desc: "Navigate separation with care" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-2xl p-4 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Start Relationship Therapy
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
