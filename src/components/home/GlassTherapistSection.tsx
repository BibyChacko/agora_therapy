import Link from "next/link";

interface Therapist {
  id: string;
  name: string;
  specialization?: string;
  languages: string[];
  rating?: number;
  imageUrl?: string;
  bio?: string;
}

interface GlassTherapistSectionProps {
  therapists: Therapist[];
}

export function GlassTherapistSection({ therapists }: GlassTherapistSectionProps) {
  const displayTherapists = therapists.slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Expert Instructors
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with licensed professionals who understand your journey and speak your language
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayTherapists.map((therapist, index) => (
            <div
              key={therapist.id}
              className="group backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Therapist Image */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={therapist.imageUrl || `https://images.unsplash.com/photo-${
                    index === 0 ? '1507003211169-0a1dd7228f2d' : 
                    index === 1 ? '1573496359142-b8d87734a5a2' : 
                    '1580489944761-15a19d654956'
                  }?w=600&h=800&fit=crop`}
                  alt={therapist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Floating badge */}
                <div className="absolute top-4 right-4 backdrop-blur-xl bg-white/30 border border-white/60 rounded-full px-4 py-2">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-semibold text-sm">{therapist.rating}</span>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-2xl mb-2">{therapist.name}</h3>
                  <p className="text-white/90 text-sm mb-3">{therapist.specialization || therapist.bio || 'Licensed Mental Health Professional'}</p>
                  <div className="flex flex-wrap gap-2">
                    {therapist.languages.slice(0, 3).map((lang, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 backdrop-blur-md bg-white/20 border border-white/40 rounded-full text-white"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="p-6">
                <Link
                  href={`/psychologists/${therapist.id}`}
                  className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/psychologists"
            className="inline-flex items-center gap-2 px-8 py-4 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/80 dark:border-gray-700/80 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            View All Therapists
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
