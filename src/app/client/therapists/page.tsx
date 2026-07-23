import Link from "next/link";
import { FileSearch } from "lucide-react";
import { ClientLayout } from "@/components/client/ClientLayout";
import { ClientTherapistsControls } from "@/components/client/ClientTherapistsControls";
import { TherapistCard } from "@/components/psychologists/TherapistCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicTherapists } from "@/lib/services/public-therapist-service";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    specialization?: string;
    language?: string;
    minExperience?: string;
    location?: string;
  }>;
};

function matchesSearch(
  therapist: Awaited<ReturnType<typeof getPublicTherapists>>[number],
  query: string
) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  const searchableText = [
    therapist.name,
    therapist.title,
    therapist.bio,
    therapist.location,
    therapist.languages.join(" "),
    therapist.specializations.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export default async function ClientTherapistsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = (params.q || "").trim();

  const therapists = await getPublicTherapists({
    specialization: params.specialization,
    language: params.language,
    minExperience: params.minExperience,
    location: params.location,
  });

  const filteredTherapists = therapists.filter((therapist) =>
    matchesSearch(therapist, searchQuery)
  );

  return (
    <ClientLayout>
      <div className="space-y-5 pb-32 sm:space-y-6 sm:pb-36 lg:space-y-8 lg:pb-0">
        <div className="rounded-[2rem] border border-teal-100 bg-[linear-gradient(135deg,_#f0fdfa_0%,_#ecfeff_48%,_#fdf2f8_100%)] px-5 py-6 shadow-[0_20px_60px_rgba(15,118,110,0.10)] sm:px-7 sm:py-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Find Your Therapist
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Browse the same verified therapist directory available on the web, then narrow it down by language, concern, experience, or a quick search.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 sm:text-sm">
            {filteredTherapists.length} therapist
            {filteredTherapists.length === 1 ? "" : "s"} available
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <ClientTherapistsControls
              initialFilters={{
                q: searchQuery,
                specialization: params.specialization || "",
                language: params.language || "",
                minExperience: params.minExperience || "",
                location: params.location || "",
              }}
            />
          </div>

          <div className="space-y-5 lg:col-span-3">
            <div className="flex flex-col gap-3 rounded-[1.6rem] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 sm:text-xl">
                  Therapist matches
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {searchQuery
                    ? `Showing ${filteredTherapists.length} result${filteredTherapists.length === 1 ? "" : "s"} for "${searchQuery}".`
                    : `Showing ${filteredTherapists.length} verified therapist${filteredTherapists.length === 1 ? "" : "s"}.`}
                </p>
              </div>

              {searchQuery || params.specialization || params.language || params.minExperience || params.location ? (
                <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200">
                  <Link href="/client/therapists">Clear search</Link>
                </Button>
              ) : null}
            </div>

            {filteredTherapists.length === 0 ? (
              <Card className="rounded-[1.8rem] border border-slate-200 bg-white shadow-sm">
                <CardContent className="flex flex-col items-center px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <FileSearch className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">
                    No therapists found
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                    Try adjusting your search, language, specialization, or experience filters to explore more therapist matches.
                  </p>
                  <Button asChild className="mt-5 rounded-xl bg-teal-600 px-5 text-white hover:bg-teal-700">
                    <Link href="/client/therapists">Reset filters</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredTherapists.map((therapist) => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
