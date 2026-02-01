import Script from 'next/script';

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": "https://mindgood.life/#organization",
    "name": "MindGood",
    "legalName": "Nextauras Global Solutions",
    "url": "https://mindgood.life",
    "logo": "https://mindgood.life/Mindgood.png",
    "foundingDate": "2025",
    "telephone": "+971505134930",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+971505134930",
      "contactType": "Customer Service",
      "availableLanguage": [
        "English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada", 
        "Marathi", "Gujarati", "Bengali", "Punjabi", "Urdu", "Sinhala",
        "German", "Spanish", "French", "Italian"
      ],
      "areaServed": "Worldwide"
    },
    "sameAs": [
      "https://mindgood.life"
    ],
    "description": "MindGood provides online therapy and counseling services in 50+ languages. Connect with licensed psychologists and therapists from anywhere in the world for professional mental health support.",
    "priceRange": "$$$",
    "medicalSpecialty": [
      "Psychiatry",
      "Psychology",
      "Mental Health Counseling",
      "Clinical Psychology",
      "Psychotherapy"
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://mindgood.life/#service",
    "serviceType": "Online Therapy and Counseling",
    "provider": {
      "@id": "https://mindgood.life/#organization"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://mindgood.life",
      "servicePhone": "+971505134930",
      "availableLanguage": [
        "English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada",
        "Marathi", "Gujarati", "Bengali", "Punjabi", "Urdu", "Sinhala",
        "German", "Spanish", "French", "Italian"
      ]
    },
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": "50",
        "priceCurrency": "USD",
        "minPrice": "50"
      },
      "availability": "https://schema.org/InStock",
      "availabilityStarts": "2025-01-01"
    },
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "termsOfService": "https://mindgood.life/terms",
    "description": "Professional online therapy and counseling services available 24/7 in 50+ languages. One-hour sessions starting from $50 USD. Connect with licensed psychologists and therapists via video, chat, or phone."
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://mindgood.life/#website",
    "url": "https://mindgood.life",
    "name": "MindGood",
    "description": "Online Therapy & Counseling in Your Language | 24/7 Mental Health Support",
    "publisher": {
      "@id": "https://mindgood.life/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mindgood.life/psychologists?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": [
      "en", "hi", "ta", "te", "ml", "kn", "mr", "gu", "bn", "pa", 
      "ur", "si", "de", "es", "fr", "it"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mindgood.life"
      }
    ]
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "MindGood Online Therapy",
    "image": "https://mindgood.life/Mindgood.png",
    "url": "https://mindgood.life",
    "telephone": "+971505134930",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.2048",
      "longitude": "55.2708"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "paymentAccepted": "Credit Card, Debit Card, Apple Pay, Google Pay",
    "currenciesAccepted": "USD"
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="professional-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
    </>
  );
}
