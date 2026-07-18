"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { trackLanguageDiscovery } from "@/lib/analytics/gtag";

interface Language {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
  region?: string;
}

interface GlassLanguageSectionProps {
  languages: Language[];
}

export function GlassLanguageSection({ languages }: GlassLanguageSectionProps) {
  const previewLimit = 10;

  const groupedLanguages = useMemo(() => {
    const grouped = languages.reduce<Record<string, Language[]>>((acc, language) => {
      const region = language.region || "More Languages";
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(language);
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => {
      const order = ["India", "South Asia", "International", "More Languages"];
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });
  }, [languages]);

  const [activeRegion, setActiveRegion] = useState(groupedLanguages[0]?.[0] || "India");

  const visibleLanguages =
    groupedLanguages.find(([region]) => region === activeRegion)?.[1] || languages;

  const previewLanguages = visibleLanguages.slice(0, previewLimit);
  const hasMoreLanguages = visibleLanguages.length > previewLimit;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Speak Your Language,
            <span className="block text-blue-700 dark:text-blue-300">
              Share Your Story
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect with therapists who understand your culture and speak your language. 
            Mental health support in 50+ languages.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {groupedLanguages.map(([region, regionLanguages]) => (
              <button
                key={region}
                type="button"
                onClick={() => {
                  setActiveRegion(region);
                  trackLanguageDiscovery({
                    click_target: "region_tab",
                    region,
                    visible_language_count: regionLanguages.length,
                    total_language_count: languages.length,
                  });
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeRegion === region
                    ? "bg-blue-600 text-white shadow-lg"
                    : "backdrop-blur-md bg-white/60 text-gray-700 border border-white/70 hover:bg-white/80 dark:bg-gray-800/60 dark:text-gray-200 dark:border-gray-700/70 dark:hover:bg-gray-800/80"
                }`}
              >
                {region}
                <span className={`ml-2 text-xs ${activeRegion === region ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                  {regionLanguages.length}
                </span>
              </button>
            ))}
          </div>

          <div className="mb-6 text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Browse therapists by language group first, then choose the language that feels most natural to you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {previewLanguages.map((language) => (
              <Link
                key={language.code}
                href={`/psychologists?language=${language.code}`}
                onClick={() =>
                  trackLanguageDiscovery({
                    click_target: "language_card",
                    region: activeRegion,
                    language_code: language.code,
                    language_name: language.name,
                    visible_language_count: visibleLanguages.length,
                    total_language_count: languages.length,
                  })
                }
                className="group rounded-2xl border border-white/60 bg-white/50 p-5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/70 hover:shadow-xl dark:border-gray-700/60 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
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
                  {language.region && (
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
                      {language.region}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {hasMoreLanguages && (
            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {previewLanguages.length} of {visibleLanguages.length} languages in {activeRegion}.
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/languages"
            onClick={() =>
              trackLanguageDiscovery({
                click_target: "view_all_languages",
                region: activeRegion,
                visible_language_count: visibleLanguages.length,
                total_language_count: languages.length,
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
          >
            View All Languages
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t see your language here?{" "}
            <Link
              href="/languages"
              onClick={() =>
                trackLanguageDiscovery({
                  click_target: "browse_all_languages",
                  region: activeRegion,
                  visible_language_count: visibleLanguages.length,
                  total_language_count: languages.length,
                })
              }
              className="font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-blue-300"
            >
              Browse every language and therapist match
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
