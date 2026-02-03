import Link from "next/link";

interface Language {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
}

interface GlassLanguageSectionProps {
  languages: Language[];
}

export function GlassLanguageSection({ languages }: GlassLanguageSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Speak Your Language,
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Share Your Story
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with therapists who understand your culture and speak your language. 
            Mental health support in 50+ languages.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {languages.map((language) => (
            <div
              key={language.code}
              className="group backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:bg-white/70 dark:hover:bg-gray-800/70"
            >
              <div className="text-center">
                {language.flag && (
                  <div className="text-4xl mb-3">{language.flag}</div>
                )}
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {language.name}
                </h3>
                {language.nativeName && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language.nativeName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/psychologists"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Find Your Therapist
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
