import { Metadata } from "next";
import Link from "next/link";
import { siteName, siteUrl, supportPhone } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Online Counselling in Dubai, UAE | Multilingual Therapy",
  description:
    "Book confidential online counselling in Dubai with multilingual psychologists. Get support for anxiety, depression, stress, relationships, and expat life across Dubai, the UAE, and GCC.",
  keywords: [
    "online counselling dubai",
    "online counseling dubai",
    "online therapist dubai",
    "online psychologist dubai",
    "counselling uae",
    "therapy dubai",
    "expat therapist dubai",
    "multilingual therapist dubai",
  ],
  alternates: {
    canonical: `${siteUrl}/online-counselling-dubai`,
  },
  openGraph: {
    title: "Online Counselling in Dubai, UAE | MindGood",
    description:
      "Private online counselling for Dubai, the UAE, and GCC with multilingual psychologists.",
    url: `${siteUrl}/online-counselling-dubai`,
    locale: "en_AE",
    type: "website",
  },
};

const faqs = [
  {
    q: "How does online counselling work in Dubai?",
    a: "You choose a therapist, book a suitable time, and join a secure online session from your phone or laptop. MindGood is designed for clients in Dubai and the GCC who need flexible support around work, family, and time-zone demands.",
  },
  {
    q: "Can I find a therapist who understands expat life in Dubai?",
    a: "Yes. MindGood focuses on multilingual and culturally aware support, which is especially helpful for expats, couples, and families navigating relocation, work pressure, isolation, and relationship stress.",
  },
  {
    q: "What issues can online counselling help with?",
    a: "People commonly seek support for anxiety, depression, burnout, grief, relationship challenges, trauma, and life transitions. We also support concerns that are common in fast-paced multicultural cities such as Dubai.",
  },
  {
    q: "Can I choose a therapist by language?",
    a: "Yes. You can browse therapists and filter by language so you can speak in the language that feels most natural and emotionally comfortable for you.",
  },
];

export default function OnlineCounsellingDubaiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        name: "Online Counselling in Dubai",
        url: `${siteUrl}/online-counselling-dubai`,
        description:
          "Multilingual online counselling for clients in Dubai, the UAE, and GCC.",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Online Counselling Dubai",
            item: `${siteUrl}/online-counselling-dubai`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
              Dubai, UAE & GCC
            </p>
            <h1 className="mb-6 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Online Counselling in Dubai
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {siteName} helps individuals, couples, and families access confidential
              online counselling with multilingual psychologists who understand the
              realities of life in Dubai and the wider GCC.
            </p>
          </div>

          <div className="mb-10 rounded-3xl bg-gradient-to-br from-teal-50 to-cyan-50 p-8 dark:from-teal-950/20 dark:to-cyan-950/20">
            <h2 className="mb-4 text-2xl font-black text-gray-900 dark:text-white">
              Why this page matters for Dubai clients
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 dark:bg-gray-900">
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                  Flexible online access
                </h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Therapy that fits demanding schedules, evening availability needs,
                  and busy workweeks common in Dubai.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 dark:bg-gray-900">
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                  Multilingual support
                </h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Speak in the language that feels natural to you, which can make
                  difficult emotions easier to express.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 dark:bg-gray-900">
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                  Culturally aware care
                </h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Support that understands expat transitions, family expectations,
                  workplace pressure, and multicultural relationships.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 dark:bg-gray-900">
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                  Private and convenient
                </h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Join sessions from home or while travelling in the GCC without
                  needing to commute across the city.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <Link
              href="/psychologists?specialization=anxiety"
              className="rounded-2xl border border-gray-200 p-6 transition hover:border-teal-500 hover:shadow-lg dark:border-gray-800"
            >
              <h3 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                Anxiety therapy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Find online support for worry, panic, overwhelm, and stress.
              </p>
            </Link>
            <Link
              href="/psychologists?specialization=depression"
              className="rounded-2xl border border-gray-200 p-6 transition hover:border-teal-500 hover:shadow-lg dark:border-gray-800"
            >
              <h3 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                Depression counselling
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Connect with therapists for low mood, hopelessness, and burnout.
              </p>
            </Link>
            <Link
              href="/psychologists?specialization=couples-therapy"
              className="rounded-2xl border border-gray-200 p-6 transition hover:border-teal-500 hover:shadow-lg dark:border-gray-800"
            >
              <h3 className="mb-2 text-xl font-black text-gray-900 dark:text-white">
                Couples therapy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Support for communication, trust, intimacy, and recurring conflict.
              </p>
            </Link>
          </div>

          <div className="mb-10 rounded-3xl bg-gray-50 p-8 dark:bg-gray-900">
            <h2 className="mb-5 text-2xl font-black text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
            <div className="space-y-5">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl bg-white p-5 dark:bg-black">
                  <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                    {item.q}
                  </h3>
                  <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 p-8 text-white dark:bg-teal-700">
            <h2 className="mb-3 text-2xl font-black">Ready to book online counselling?</h2>
            <p className="mb-6 max-w-2xl text-sm leading-6 text-white/85">
              Browse multilingual therapists, compare expertise, and book a session
              that fits your schedule in Dubai or anywhere across the GCC.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/psychologists"
                className="rounded-full bg-white px-6 py-3 font-bold text-gray-900 transition hover:scale-105"
              >
                Browse therapists
              </Link>
              <a
                href={`tel:${supportPhone}`}
                className="rounded-full border border-white/40 px-6 py-3 font-bold text-white transition hover:bg-white/10"
              >
                Call {supportPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
