/**
 * Comprehensive Language List
 * Includes all major Indian languages and international languages
 */

export interface Language {
  code: string;
  name: string;
  nativeName?: string;
  region: string;
  flag?: string;
}

export const LANGUAGES: Language[] = [
  // Indian Languages (Official and Regional)
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "India", flag: "🇮🇳" },
  { code: "en", name: "English", region: "India", flag: "🇬🇧" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "India", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", region: "India", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मরাठी", region: "India", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", region: "India", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "India", flag: "🇵🇰" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", region: "India", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", region: "India", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", region: "India", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", region: "India", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", region: "India", flag: "🇮🇳" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", region: "India", flag: "🇳🇵" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", region: "India", flag: "🇵🇰" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", region: "India", flag: "🇮🇳" },

  // South Asian Languages
  { code: "si", name: "Sinhala", nativeName: "සිංහල", region: "South Asia", flag: "🇱🇰" },
  { code: "dv", name: "Dhivehi", nativeName: "ދިވެހި", region: "South Asia", flag: "🇲🇻" },
  
  // Major International Languages
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文", region: "International", flag: "🇨🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", region: "International", flag: "🇪🇸" },
  { code: "ar", name: "Arabic", nativeName: "العربية", region: "International", flag: "🇦🇪" },
  { code: "fr", name: "French", nativeName: "Français", region: "International", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", region: "International", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", region: "International", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese", nativeName: "Português", region: "International", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", region: "International", flag: "🇷🇺" },
  { code: "it", name: "Italian", nativeName: "Italiano", region: "International", flag: "🇮🇹" },
  { code: "ko", name: "Korean", nativeName: "한국어", region: "International", flag: "🇰🇷" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", region: "International", flag: "🇹🇷" },
  { code: "pl", name: "Polish", nativeName: "Polski", region: "International", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", region: "International", flag: "🇳🇱" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", region: "International", flag: "🇻🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", region: "International", flag: "🇹🇭" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", region: "International", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", region: "International", flag: "🇲🇾" },
  { code: "fa", name: "Persian", nativeName: "فارسی", region: "International", flag: "🇮🇷" },
  { code: "he", name: "Hebrew", nativeName: "עברית", region: "International", flag: "🇮🇱" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", region: "International", flag: "🇬🇷" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", region: "International", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", region: "International", flag: "🇳🇴" },
  { code: "da", name: "Danish", nativeName: "Dansk", region: "International", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", region: "International", flag: "🇫🇮" },
  { code: "cs", name: "Czech", nativeName: "Čeština", region: "International", flag: "🇨🇿" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", region: "International", flag: "🇭🇺" },
  { code: "ro", name: "Romanian", nativeName: "Română", region: "International", flag: "🇷🇴" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", region: "International", flag: "🇺🇦" },
];

// Group languages by region
export const LANGUAGE_GROUPS = LANGUAGES.reduce((acc, lang) => {
  if (!acc[lang.region]) {
    acc[lang.region] = [];
  }
  acc[lang.region].push(lang);
  return acc;
}, {} as Record<string, Language[]>);

// Get language name by code
export function getLanguageName(code: string): string {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang?.name || code;
}

// Get language by code
export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

// Get languages by codes
export function getLanguagesByCodes(codes: string[]): Language[] {
  return LANGUAGES.filter((l) => codes.includes(l.code));
}

// Popular Indian languages (for quick selection)
export const POPULAR_INDIAN_LANGUAGES = [
  "en", // English
  "hi", // Hindi
  "bn", // Bengali
  "te", // Telugu
  "mr", // Marathi
  "ta", // Tamil
  "gu", // Gujarati
  "kn", // Kannada
  "ml", // Malayalam
  "pa", // Punjabi
];

// Popular International languages
export const POPULAR_INTERNATIONAL_LANGUAGES = [
  "ar", // Arabic
  "es", // Spanish
  "fr", // French
  "zh", // Chinese
  "de", // German
  "ja", // Japanese
  "ko", // Korean
  "ru", // Russian
];
