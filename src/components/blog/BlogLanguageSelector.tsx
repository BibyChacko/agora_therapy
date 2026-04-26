'use client';

import React, { useState } from 'react';
import { FiShare2, FiBookmark } from 'react-icons/fi';

interface BlogLanguageSelectorProps {
  languages: string[];
  initialLanguage: string;
}

export default function BlogLanguageSelector({ languages, initialLanguage }: BlogLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-white dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Read in:</span>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedLanguage === lang 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-indigo-600 transition-colors"><FiBookmark size={20} /></button>
        <button className="text-gray-400 hover:text-indigo-600 transition-colors"><FiShare2 size={20} /></button>
      </div>
    </div>
  );
}
