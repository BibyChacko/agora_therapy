import Script from 'next/script';
import { dubaiAddress, gccAreas, organizationName, seoLanguages, siteName, siteUrl, supportEmail, supportPhone } from '@/lib/seo';

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${siteUrl}/#organization`,
    "name": siteName,
    "legalName": organizationName,
    "url": siteUrl,
    "logo": `${siteUrl}/Mindgood.png`,
    "foundingDate": "2025",
    "email": supportEmail,
    "telephone": supportPhone,
    "address": {
      "@type": "PostalAddress",
      ...dubaiAddress,
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": supportPhone,
      "email": supportEmail,
      "contactType": "Customer Service",
      "areaServed": gccAreas,
      "availableLanguage": seoLanguages,
    },
    "sameAs": [
      "https://mindgood.life",
      "https://www.instagram.com/mindgood.life/",
      "https://www.linkedin.com/company/mind-good/posts/",
    ],
    "description": "MindGood provides multilingual online therapy and counselling for individuals, couples, and families in Dubai, the UAE, and across the GCC.",
    "priceRange": "$$",
    "areaServed": gccAreas,
    "medicalSpecialty": [
      "Psychology",
      "Mental Health Counseling",
      "Clinical Psychology",
      "Psychotherapy",
      "Couples Therapy",
      "Anxiety Therapy",
      "Depression Counselling"
    ],
    "knowsAbout": [
      "Online therapy in Dubai",
      "Multilingual counselling in the UAE",
      "Expat mental health support",
      "Couples therapy in Dubai",
      "Anxiety and stress therapy",
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service`,
    "name": "Online Therapy and Counselling",
    "serviceType": "Online Therapy and Counseling",
    "provider": {
      "@id": `${siteUrl}/#organization`
    },
    "areaServed": gccAreas,
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": siteUrl,
      "servicePhone": supportPhone,
      "availableLanguage": seoLanguages,
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/psychologists`,
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "AED",
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
    "termsOfService": `${siteUrl}/terms`,
    "description": "Professional online therapy and counselling for Dubai, the UAE, and the GCC with multilingual psychologists supporting anxiety, stress, relationships, trauma, and family wellbeing."
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": siteName,
    "description": "Online therapy in Dubai, UAE and GCC with multilingual psychologists.",
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/psychologists?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["en", "ar", "hi", "ml", "ta", "te", "kn", "ur"]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `${siteName} Online Therapy`,
    "image": `${siteUrl}/Mindgood.png`,
    "url": siteUrl,
    "telephone": supportPhone,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      ...dubaiAddress,
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
    "areaServed": gccAreas,
    "paymentAccepted": "Credit Card, Debit Card, Apple Pay, Google Pay",
    "currenciesAccepted": "AED, USD"
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
