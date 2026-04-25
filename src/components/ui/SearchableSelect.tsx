"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown, FiX, FiCheck } from "react-icons/fi";

interface Option {
  id: string;
  name: string;
  description?: string;
  group?: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
  placeholder?: string;
  emptyMessage?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  label, 
  placeholder = "Search...",
  emptyMessage = "No options found"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.description && opt.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedOptions = filteredOptions.reduce((acc, opt) => {
    const group = opt.group || "Default";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(opt);
    return acc;
  }, {} as Record<string, Option[]>);

  const selectedOption = options.find(opt => opt.id === value);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full p-2 border rounded-md cursor-pointer transition-all
          bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          ${isOpen ? "border-teal-500 ring-2 ring-teal-500/20" : "border-gray-300 dark:border-gray-700"}
        `}
      >
        <span className={value ? "text-gray-900 dark:text-white" : "text-gray-400"}>
          {selectedOption ? selectedOption.name : `Select ${label}`}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <FiX 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" 
              onClick={clearSelection}
            />
          )}
          <FiChevronDown className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder={placeholder}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border-none rounded-md focus:ring-0 text-gray-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {Object.keys(groupedOptions).length > 0 ? (
              <>
                <div 
                  onClick={() => handleSelect("")}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/20 ${!value ? "text-teal-600 font-bold" : "text-gray-700 dark:text-gray-300"}`}
                >
                  All {label}s
                </div>
                {Object.entries(groupedOptions).map(([group, opts]) => (
                  <div key={group}>
                    {group !== "Default" && (
                      <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                        {group}
                      </div>
                    )}
                    {opts.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`
                          flex items-center justify-between px-4 py-2 text-sm cursor-pointer
                          hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors
                          ${value === opt.id ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 font-bold" : "text-gray-700 dark:text-gray-300"}
                        `}
                      >
                        <div className="flex flex-col">
                          <span>{opt.name}</span>
                          {opt.description && (
                            <span className="text-[10px] opacity-60 font-normal line-clamp-1">{opt.description}</span>
                          )}
                        </div>
                        {value === opt.id && <FiCheck className="text-teal-600" />}
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
