'use client';

import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FiFilter, FiX } from 'react-icons/fi';
import SearchableSelect from '../ui/SearchableSelect';
import { LANGUAGES, getLanguageName } from '@/lib/constants/languages';
import { AVAILABLE_SERVICES } from '@/types/models/service';

interface PsychologistFiltersProps {
  initialFilters?: { specialization: string; language: string; minExperience: string };
}

const PsychologistFilters: React.FC<PsychologistFiltersProps> = ({ initialFilters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [language, setLanguage] = useState(initialFilters?.language || '');
  const [specialization, setSpecialization] = useState(initialFilters?.specialization || '');
  const [minExperience, setMinExperience] = useState(initialFilters?.minExperience || '');

  const updateParams = (filters: { specialization: string; language: string; minExperience: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.specialization) params.set('specialization', filters.specialization);
    else params.delete('specialization');
    
    if (filters.language) params.set('language', filters.language);
    else params.delete('language');
    
    if (filters.minExperience) params.set('minExperience', filters.minExperience);
    else params.delete('minExperience');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecialization(value);
    updateParams({ specialization: value, language, minExperience });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    updateParams({ specialization, language: value, minExperience });
  };

  const handleExperienceChange = (value: string) => {
    setMinExperience(value);
    updateParams({ specialization, language, minExperience: value });
  };

  const resetFilters = () => {
    setLanguage('');
    setSpecialization('');
    setMinExperience('');
    router.push(pathname);
  };

  // Prepare options for SearchableSelect
  const languageOptions = LANGUAGES.map(lang => ({
    id: lang.code,
    name: lang.name,
    description: lang.nativeName,
    group: lang.region
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

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiFilter className="mr-2 text-teal-600" /> Filters
          </h2>
          <button 
            onClick={resetFilters}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Reset All
          </button>
        </div>
        
        {/* Language Filter */}
        <div className="mb-6">
          <SearchableSelect
            label="Language"
            value={language}
            onChange={handleLanguageChange}
            options={languageOptions}
            placeholder="Search languages..."
          />
        </div>
        
        {/* Specialization Filter */}
        <div className="mb-6">
          <SearchableSelect
            label="Specialization"
            value={specialization}
            onChange={handleSpecializationChange}
            options={specializationOptions}
            placeholder="Search specializations..."
          />
        </div>
        
        {/* Experience Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Experience
          </label>
          <select
            value={minExperience}
            onChange={(e) => handleExperienceChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">Any Experience</option>
            <option value="1">1+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>
        
        {/* Active Filters */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {language && (
              <div className="flex items-center bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-xs px-2 py-1 rounded-full">
                {getLanguageName(language)}
                <button onClick={() => handleLanguageChange('')} className="ml-1">
                  <FiX />
                </button>
              </div>
            )}
            {specialization && (
              <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                {AVAILABLE_SERVICES.find(s => s.id === specialization)?.name || specialization}
                <button onClick={() => handleSpecializationChange('')} className="ml-1">
                  <FiX />
                </button>
              </div>
            )}
            {minExperience && (
              <div className="flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                {minExperience}+ years
                <button onClick={() => handleExperienceChange('')} className="ml-1">
                  <FiX />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PsychologistFilters;
