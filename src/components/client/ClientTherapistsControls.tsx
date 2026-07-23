"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import PsychologistFilters from "@/components/psychologists/PsychologistFilters";
import { Input } from "@/components/ui/input";
import { AVAILABLE_SERVICES } from "@/types/models/service";
import { LANGUAGES } from "@/lib/constants/languages";

type ControlsProps = {
  initialFilters: {
    q?: string;
    specialization?: string;
    language?: string;
    minExperience?: string;
    location?: string;
  };
};

const MOBILE_LOCATIONS = [
  { id: "", name: "Any location" },
  { id: "dubai", name: "Dubai" },
  { id: "abu-dhabi", name: "Abu Dhabi" },
  { id: "sharjah", name: "Sharjah" },
  { id: "india", name: "India" },
  { id: "singapore", name: "Singapore" },
  { id: "london", name: "London" },
];

const EXPERIENCE_OPTIONS = [
  { id: "", name: "Any experience" },
  { id: "5", name: "5+ years" },
  { id: "10", name: "10+ years" },
  { id: "15", name: "15+ years" },
];

export function ClientTherapistsControls({ initialFilters }: ControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialFilters.q || "");
  const [specialization, setSpecialization] = useState(initialFilters.specialization || "");
  const [language, setLanguage] = useState(initialFilters.language || "");
  const [minExperience, setMinExperience] = useState(initialFilters.minExperience || "");
  const [location, setLocation] = useState(initialFilters.location || "");

  useEffect(() => {
    setSearchQuery(initialFilters.q || "");
    setSpecialization(initialFilters.specialization || "");
    setLanguage(initialFilters.language || "");
    setMinExperience(initialFilters.minExperience || "");
    setLocation(initialFilters.location || "");
  }, [
    initialFilters.q,
    initialFilters.specialization,
    initialFilters.language,
    initialFilters.minExperience,
    initialFilters.location,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      } else {
        params.delete("q");
      }

      if (specialization) {
        params.set("specialization", specialization);
      } else {
        params.delete("specialization");
      }

      if (language) {
        params.set("language", language);
      } else {
        params.delete("language");
      }

      if (minExperience) {
        params.set("minExperience", minExperience);
      } else {
        params.delete("minExperience");
      }

      if (location) {
        params.set("location", location);
      } else {
        params.delete("location");
      }

      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [language, location, minExperience, pathname, router, searchParams, searchQuery, specialization]);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.1rem] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[1.25rem] sm:p-4 lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
        <div className="relative lg:hidden">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by therapist name, language, specialization, or bio"
            className="h-12 rounded-xl border-slate-200 pl-11 text-sm"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 lg:hidden">
          <label className="space-y-1.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Location
            </span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400"
            >
              {MOBILE_LOCATIONS.map((option) => (
                <option key={option.id || "all-location"} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Language
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400"
            >
              <option value="">Any language</option>
              {LANGUAGES.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Focus
            </span>
            <select
              value={specialization}
              onChange={(event) => setSpecialization(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400"
            >
              <option value="">Any focus</option>
              {AVAILABLE_SERVICES.filter((service) => service.isActive).map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Experience
            </span>
            <select
              value={minExperience}
              onChange={(event) => setMinExperience(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-teal-400"
            >
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option.id || "all-experience"} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="hidden lg:block">
          <div className="mb-4 rounded-[1.1rem] border border-slate-200 bg-white p-3 shadow-sm sm:rounded-[1.25rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by therapist name, language, specialization, or bio"
                className="h-12 rounded-xl border-slate-200 pl-11 text-sm"
              />
            </div>
          </div>

          <PsychologistFilters
            initialFilters={{
              specialization,
              language,
              minExperience,
              location,
            }}
          />
        </div>
      </div>
    </div>
  );
}
