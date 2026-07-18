"use client";

import { useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { trackServiceSearch } from "@/lib/analytics/gtag";

interface ServicesSearchFormProps {
  query: string;
  resultCount: number;
}

export function ServicesSearchForm({
  query,
  resultCount,
}: ServicesSearchFormProps) {
  const hasTrackedInitialQuery = useRef(false);

  useEffect(() => {
    if (!query || hasTrackedInitialQuery.current) {
      return;
    }

    trackServiceSearch({
      query,
      result_count: resultCount,
      event_source: "page_load",
    });
    hasTrackedInitialQuery.current = true;
  }, [query, resultCount]);

  return (
    <form
      action="/services"
      method="GET"
      className="max-w-2xl mx-auto"
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        const submittedQuery = String(formData.get("q") || "").trim();

        if (!submittedQuery) {
          return;
        }

        trackServiceSearch({
          query: submittedQuery,
          event_source: "submit",
        });
      }}
    >
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          name="q"
          type="text"
          defaultValue={query}
          placeholder="Search services (e.g., anxiety, couples therapy...)"
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
        />
      </div>
      {query && (
        <p className="mt-4 text-sm text-gray-500 font-medium">
          Showing {resultCount} results for "{query}"
        </p>
      )}
    </form>
  );
}

