'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FiFilter, FiMapPin, FiGlobe, FiBriefcase } from 'react-icons/fi';
import SearchableSelect from '../ui/SearchableSelect';
import { LANGUAGES } from '@/lib/constants/languages';
import { AVAILABLE_SERVICES } from '@/types/models/service';

interface PsychologistFiltersProps {
  initialFilters?: { specialization?: string; language?: string; minExperience?: string; location?: string };
}

const LOCATIONS = [
  { id: 'dubai', name: 'Dubai', group: 'United Arab Emirates' },
  { id: 'abu-dhabi', name: 'Abu Dhabi', group: 'United Arab Emirates' },
  { id: 'sharjah', name: 'Sharjah', group: 'United Arab Emirates' },
  { id: 'india', name: 'India', group: 'International' },
  { id: 'singapore', name: 'Singapore', group: 'International' },
  { id: 'london', name: 'London', group: 'International' },
];

const PsychologistFilters: React.FC<PsychologistFiltersProps> = ({ initialFilters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [language, setLanguage] = useState(initialFilters?.language || '');
  const [specialization, setSpecialization] = useState(initialFilters?.specialization || '');
  const [minExperience, setMinExperience] = useState(initialFilters?.minExperience || '');
  const [location, setLocation] = useState(initialFilters?.location || '');

  const updateParams = (filters: { specialization: string; language: string; minExperience: string; location: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.specialization) params.set('specialization', filters.specialization);
    else params.delete('specialization');
    
    if (filters.language) params.set('language', filters.language);
    else params.delete('language');
    
    if (filters.minExperience) params.set('minExperience', filters.minExperience);
    else params.delete('minExperience');

    if (filters.location) params.set('location', filters.location);
    else params.delete('location');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecialization(value);
    updateParams({ specialization: value, language, minExperience, location });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    updateParams({ specialization, language: value, minExperience, location });
  };

  const handleExperienceChange = (value: string) => {
    setMinExperience(value);
    updateParams({ specialization, language, minExperience: value, location });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    updateParams({ specialization, language, minExperience, location: value });
  };

  const resetFilters = () => {
    setLanguage('');
    setSpecialization('');
    setMinExperience('');
    setLocation('');
    router.push(pathname);
  };

  // Prepare options for SearchableSelect
  const languageOptions = LANGUAGES.map(lang => ({
    id: lang.code,
    name: lang.name,
    description: lang.nativeName,
    group: lang.region,
    icon: lang.flag
  }));

  const specializationOptions = AVAILABLE_SERVICES.map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    group: service.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));

  return (
    <>
      {/* Mobile Toggle Button (Only visible on mobile) */}
      <div className="md:hidden mb-4">
        <button className="w-full flex items-center justify-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
          <FiFilter className="mr-2" /> Filters
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl p-8 sticky top-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
            <FiFilter className="mr-3 text-indigo-600" /> Filters
          </h2>
          <button 
            onClick={resetFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider"
          >
            Reset All
          </button>
        </div>
        
        {/* Location Filter */}
        <div className="mb-8">
          <SearchableSelect
            label="Practice Location"
            options={LOCATIONS}
            value={location}
            onChange={handleLocationChange}
            placeholder="Search city or country..."
          />
        </div>

        {/* Language Filter */}
        <div className="mb-8">
          <SearchableSelect
            label="Language Spoken"
            options={languageOptions}
            value={language}
            onChange={handleLanguageChange}
            placeholder="Search language..."
          />
        </div>
        
        {/* Specialization Filter */}
        <div className="mb-8">
          <SearchableSelect
            label="Clinical Focus"
            options={specializationOptions}
            value={specialization}
            onChange={handleSpecializationChange}
            placeholder="Search clinical focus..."
          />
        </div>
        
        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
            Min. Experience
          </label>
          <select 
            value={minExperience}
            onChange={(e) => handleExperienceChange(e.target.value)}
            className="w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
          >
            <option value="">Any Experience</option>
            <option value="5">5+ Years</option>
            <option value="10">10+ Years</option>
            <option value="15">15+ Years</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default PsychologistFilters;
