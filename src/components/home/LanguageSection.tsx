import { Language } from '@/lib/constants/languages';

interface LanguageSectionProps {
  languages: Language[];
}

export function LanguageSection({ languages }: LanguageSectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Support in Your Language</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform connects you with psychologists who speak your native language, ensuring effective communication and cultural understanding.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {languages.map((language) => (
            <div key={language.code} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-600/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {language.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">{language.name}</h3>
              {language.nativeName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{language.nativeName}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
