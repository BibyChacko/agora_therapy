import Link from "next/link";

export function GlassMeditationSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=800&fit=crop"
          alt="Meditation Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <p className="text-sm font-semibold text-teal-400 uppercase tracking-wider">
                More Inner Efficiency
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Where Sustainability
                <br />
                Meets Meditation.
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Discover the perfect balance between mental wellness and personal growth. 
                Our holistic approach combines traditional therapy with mindfulness practices.
              </p>
              
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Start Doing Today
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 border-2 border-white"
                    ></div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center text-xs font-bold">
                    +5k
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">The latest research</p>
                  <p className="text-xs text-gray-400">and strategies for stress relief</p>
                </div>
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div className="relative h-96 lg:h-[500px]">
              {/* Card 1 */}
              <div className="absolute top-0 right-0 w-64 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl p-6 shadow-2xl">
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
                    alt="Meditation Practice"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  Experience the Future of Meditation
                </h3>
                <p className="text-white/80 text-sm">
                  Bring home AI-guided with leading experts virtually.
                </p>
              </div>

              {/* Card 2 - Testimonial */}
              <div className="absolute bottom-0 left-0 w-72 backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 border-2 border-white"></div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  "This platform transformed my approach to mental health. The therapists are incredibly supportive and understanding."
                </p>
                <p className="text-white/60 text-xs mt-2">- Sarah M., Client since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
