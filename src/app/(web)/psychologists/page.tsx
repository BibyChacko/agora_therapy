"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PsychologistFilters from '@/components/psychologists/PsychologistFilters';
import { TherapistCard } from '@/components/psychologists/TherapistCard';
import { TherapistPublicView } from '@/types/models/therapist';

function PsychologistsContent() {
  const searchParams = useSearchParams();
  const [therapists, setTherapists] = useState<TherapistPublicView[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    language: '',
    minExperience: '',
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const specializationParam = searchParams.get('specialization');
    const languageParam = searchParams.get('language');
    const minExperienceParam = searchParams.get('minExperience');

    setFilters({
      specialization: specializationParam || '',
      language: languageParam || '',
      minExperience: minExperienceParam || '',
    });
  }, [searchParams]);

  useEffect(() => {
    fetchTherapists();
  }, [filters]);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.language) params.append('language', filters.language);
      if (filters.minExperience) params.append('minExperience', filters.minExperience);

      const response = await fetch(`/api/public/therapists?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTherapists(data.therapists);
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Find Your Therapist</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Browse our directory of verified, experienced therapists and filter by language, specialization, and more to find the perfect match for your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters - Client Component */}
          <div className="lg:col-span-1">
            <PsychologistFilters 
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Therapists Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading therapists...</p>
                </div>
              </div>
            ) : therapists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No therapists found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {therapists.map((therapist) => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PsychologistsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>}>
      <PsychologistsContent />
    </Suspense>
  );
}
