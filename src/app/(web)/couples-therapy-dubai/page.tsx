import { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Couples Therapy in Dubai | Online Relationship Counselling",
  description:
    "Get online couples therapy in Dubai with multilingual psychologists. Support for communication, conflict, trust, intimacy, and relationship stress across the UAE and GCC.",
  keywords: [
    "couples therapy dubai",
    "relationship counselling dubai",
    "marriage counselling dubai",
    "online couples therapy dubai",
    "relationship therapist dubai",
    "couples therapist uae",
  ],
  alternates: {
    canonical: `${siteUrl}/couples-therapy-dubai`,
  },
  openGraph: {
    title: "Couples Therapy in Dubai | MindGood",
    description:
      "Online relationship counselling for couples in Dubai, UAE, and the GCC.",
    url: `${siteUrl}/couples-therapy-dubai`,
    locale: "en_AE",
    type: "website",
  },
};

const faqs = [
  {
    q: "When should a couple consider therapy?",
    a: "Couples often seek therapy when they feel stuck in the same conflict, struggle to communicate, feel emotionally distant, or are navigating trust, intimacy, parenting, or relocation stress.",
  },
  {
    q: "Can online couples therapy work?",
    a: "Yes. Online couples therapy can be effective when both partners are willing to engage honestly and consistently. It can also be easier to attend regularly with work and family schedules in Dubai.",
  },
  {
    q: "Do you support multicultural and intercultural couples?",
    a: "Yes. This is one of the areas where multilingual and culturally aware therapy can be especially helpful, particularly for couples navigating different backgrounds, family expectations, and communication styles.",
  },
];

export default function CouplesTherapyDubaiPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-4xl px-4">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
          Relationship Support
        </p>
        <h1 className="mb-6 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-6xl">
          Couples Therapy in Dubai
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          Online couples therapy for partners in Dubai, the UAE, and GCC who want to
          improve communication, rebuild trust, reduce conflict, and strengthen
          emotional connection.
        </p>

        <div className="mb-10 rounded-3xl bg-rose-50 p-8 dark:bg-rose-950/20">
          <h2 className="mb-4 text-2xl font-black text-gray-900 dark:text-white">
            Common reasons couples reach out
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Communication breakdowns and recurring arguments",
              "Trust, jealousy, or emotional disconnection",
              "Balancing work stress and relationship needs",
              "Premarital concerns and future planning",
              "Parenting pressure and family expectations",
              "Multicultural relationship dynamics",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white p-4 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 rounded-3xl border border-gray-200 p-8 dark:border-gray-800">
          <h2 className="mb-4 text-2xl font-black text-gray-900 dark:text-white">
            What MindGood brings to couples therapy
          </h2>
          <div className="space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            <p>
              We are especially well positioned for couples in Dubai because many
              relationships here operate under pressure from long work hours, family
              expectations, relocation, and cross-cultural communication gaps.
            </p>
            <p>
              Our online format also makes it easier to attend sessions consistently
              without adding travel time or coordination stress.
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-3xl bg-gray-50 p-8 dark:bg-gray-900">
          <h2 className="mb-5 text-2xl font-black text-gray-900 dark:text-white">
            FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="rounded-2xl bg-white p-5 dark:bg-black">
                <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{item.q}</h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/psychologists?specialization=couples-therapy"
            className="rounded-full bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700"
          >
            Find couples therapists
          </Link>
          <Link
            href="/online-counselling-dubai"
            className="rounded-full border border-gray-300 px-6 py-3 font-bold text-gray-900 transition hover:border-teal-500 dark:border-gray-700 dark:text-white"
          >
            Explore online counselling
          </Link>
        </div>
      </div>
    </div>
  );
}
