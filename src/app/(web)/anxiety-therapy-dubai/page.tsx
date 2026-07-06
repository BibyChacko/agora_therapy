import { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Anxiety Therapy in Dubai | Online Anxiety Counselling",
  description:
    "Find online anxiety therapy in Dubai with multilingual psychologists. Get support for worry, panic, stress, burnout, and overthinking across the UAE and GCC.",
  keywords: [
    "anxiety therapy dubai",
    "anxiety counsellor dubai",
    "online anxiety therapy dubai",
    "panic attack therapist dubai",
    "stress therapist dubai",
    "anxiety psychologist uae",
  ],
  alternates: {
    canonical: `${siteUrl}/anxiety-therapy-dubai`,
  },
  openGraph: {
    title: "Anxiety Therapy in Dubai | MindGood",
    description:
      "Online anxiety counselling for Dubai, UAE, and GCC with multilingual therapists.",
    url: `${siteUrl}/anxiety-therapy-dubai`,
    locale: "en_AE",
    type: "website",
  },
};

export default function AnxietyTherapyDubaiPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16 dark:bg-black">
      <div className="container mx-auto max-w-4xl px-4">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
          Mental Health Support
        </p>
        <h1 className="mb-6 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-6xl">
          Anxiety Therapy in Dubai
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          Support for anxiety, panic, overwhelm, sleep disruption, racing thoughts,
          and chronic stress with online therapy designed for clients in Dubai, the
          UAE, and wider GCC.
        </p>

        <div className="mb-10 rounded-3xl bg-cyan-50 p-8 dark:bg-cyan-950/20">
          <h2 className="mb-4 text-2xl font-black text-gray-900 dark:text-white">
            Anxiety can show up in many ways
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Constant worry and overthinking",
              "Panic attacks or physical tension",
              "Work stress and burnout",
              "Social anxiety and avoidance",
              "Health anxiety and fear of bad outcomes",
              "Sleep issues linked to stress",
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
            Why this matters in Dubai and the GCC
          </h2>
          <div className="space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
            <p>
              Many clients deal with anxiety shaped by relocation, demanding jobs,
              uncertainty, high performance culture, and distance from support
              systems. Therapy can help you slow the cycle of worry and build better
              coping patterns.
            </p>
            <p>
              Online therapy also makes it easier to get help before anxiety starts
              affecting work, relationships, or daily functioning.
            </p>
          </div>
        </div>

        <div className="mb-10 rounded-3xl bg-gray-50 p-8 dark:bg-gray-900">
          <h2 className="mb-4 text-2xl font-black text-gray-900 dark:text-white">
            What support can include
          </h2>
          <ul className="grid gap-3 text-sm text-gray-600 dark:text-gray-300 md:grid-cols-2">
            <li>Evidence-based strategies for anxious thoughts</li>
            <li>Breathing and grounding tools for panic</li>
            <li>Stress and burnout management</li>
            <li>Understanding emotional triggers</li>
            <li>Building confidence in daily situations</li>
            <li>Healthier routines for sleep and regulation</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/psychologists?specialization=anxiety"
            className="rounded-full bg-teal-600 px-6 py-3 font-bold text-white transition hover:bg-teal-700"
          >
            Find anxiety therapists
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
