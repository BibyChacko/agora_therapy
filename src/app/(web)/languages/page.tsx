import type { Metadata } from "next";
import Link from "next/link";

import { LANGUAGES, getLanguageName } from "@/lib/constants/languages";
import { getPublicTherapists } from "@/lib/services/public-therapist-service";
import { siteUrl } from "@/lib/seo";

type LanguageWithCount = (typeof LANGUAGES)[number] & {
  therapistCount: number;
};

const REGION_ORDER = ["India", "South Asia", "International", "More Languages"];

export const metadata: Metadata = {
  title: "Languages We Support | MindGood",
  description:
    "Browse all supported languages on MindGood and find therapists who can support you in the language that feels most natural.",
  alternates: {
    canonical: `${siteUrl}/languages`,
  },
  openGraph: {
    title: "Languages We Support | MindGood",
    description:
      "Find therapists by language across MindGood, from Arabic and English to Hindi, Malayalam, Tamil, and more.",
    url: `${siteUrl}/languages`,
    type: "website",
  },
};

function buildLanguageDirectory() {
  return LANGUAGES.reduce<Record<string, LanguageWithCount[]>>((acc, language) => {
    const region = language.region || "More Languages";
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push({
      ...language,
      therapistCount: 0,
    });
    return acc;
  }, {});
}

export default async function LanguagesPage() {
  const therapists = await getPublicTherapists();
  const therapistCounts = therapists.reduce<Record<string, number>>((acc, therapist) => {
    therapist.languages.forEach((languageCode) => {
      acc[languageCode] = (acc[languageCode] || 0) + 1;
    });
    return acc;
  }, {});

  const groupedDirectory = buildLanguageDirectory();

  Object.values(groupedDirectory).forEach((languages) => {
    languages.forEach((language) => {
      language.therapistCount = therapistCounts[language.code] || 0;
    });
  });

  const orderedRegions = Object.entries(groupedDirectory).sort(([a], [b]) => {
    const aIndex = REGION_ORDER.indexOf(a);
    const bIndex = REGION_ORDER.indexOf(b);

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

  const totalMatchedLanguages = LANGUAGES.filter((language) => therapistCounts[language.code] > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">
            Language Directory
          </p>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Find a Therapist in the Language You Think In
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 md:text-lg">
            Browse every supported language and see how many therapists are currently available for each one.
            If your preferred language is available, you can go straight to the matching therapist list.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-blue-100 bg-white/80 px-5 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200">
            {totalMatchedLanguages} languages currently have therapist matches
          </div>
        </div>

        <div className="space-y-12">
          {orderedRegions.map(([region, languages]) => (
            <section key={region}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{region}</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {languages.filter((language) => language.therapistCount > 0).length} of {languages.length} languages currently have therapist matches
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {languages.map((language) => {
                  const hasTherapists = language.therapistCount > 0;
                  const href = hasTherapists
                    ? `/psychologists?language=${language.code}`
                    : "/psychologists";

                  return (
                    <Link
                      key={language.code}
                      href={href}
                      className={`rounded-2xl border p-5 transition-all duration-300 ${
                        hasTherapists
                          ? "border-white/70 bg-white/80 shadow-sm backdrop-blur hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/80"
                          : "border-gray-200/80 bg-white/50 opacity-90 dark:border-gray-800 dark:bg-gray-900/60"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl dark:bg-gray-800">
                          {language.flag || "🌐"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {language.name}
                              </h3>
                              {language.nativeName && (
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  {language.nativeName}
                                </p>
                              )}
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                hasTherapists
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {language.therapistCount} therapist{language.therapistCount === 1 ? "" : "s"}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                              {language.region}
                            </p>
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              {hasTherapists ? `View ${getLanguageName(language.code)} therapists` : "Browse all therapists"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/psychologists"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-blue-700"
          >
            View All Therapists
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
