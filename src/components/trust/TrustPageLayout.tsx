import Link from "next/link";

interface TrustSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

interface TrustPageLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: TrustSection[];
  ctaTitle: string;
  ctaBody: string;
}

const trustLinks = [
  { href: "/clinical-standards", label: "About Clinical Standards" },
  { href: "/how-we-verify-therapists", label: "How We Verify Therapists" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/medical-review-policy", label: "Medical Review Policy" },
  { href: "/crisis-emergency-help", label: "Crisis & Emergency Help" },
];

export function TrustPageLayout({
  eyebrow,
  title,
  intro,
  sections,
  ctaTitle,
  ctaBody,
}: TrustPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/40 pb-20 pt-24 dark:from-gray-950 dark:via-gray-950 dark:to-teal-950/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {intro}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <main className="space-y-6">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-[2rem] border border-gray-200 bg-white/90 p-8 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-gray-700 dark:text-gray-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-700 dark:bg-gray-800/70 dark:text-gray-300"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </main>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-teal-100 bg-white/95 p-6 shadow-sm dark:border-teal-900/40 dark:bg-gray-900/80">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Trust & Safety
              </h2>
              <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                Explore the policies and standards that guide how MindGood reviews therapists, develops content, and supports users.
              </p>
              <div className="mt-5 space-y-2">
                {trustLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950/30"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-600 p-6 text-white shadow-xl">
              <h2 className="text-xl font-black tracking-tight">{ctaTitle}</h2>
              <p className="mt-3 text-sm leading-7 text-white/90">{ctaBody}</p>
              <div className="mt-5 flex flex-col gap-3">
                <Link
                  href="/psychologists"
                  className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-teal-700 transition-transform hover:scale-[1.02]"
                >
                  Find a Therapist
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-white/40 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Contact MindGood
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
