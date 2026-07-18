import { Metadata } from 'next';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiCheck,
  FiClock,
  FiHeart,
  FiMessageSquare,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { siteUrl, supportPhone } from '@/lib/seo';

const whatsappNumber = '971505134930';
const whatsappMessage = encodeURIComponent(
  'Hello MindGood, I would like to discuss a corporate collaboration for employee wellbeing support.'
);
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

const workplaceStats = [
  {
    value: '1 in 3',
    title: 'employees report burnout symptoms',
    description: 'High-performing teams still struggle when pressure, uncertainty, and emotional fatigue go unmanaged.',
    icon: FiClock,
  },
  {
    value: '40%',
    title: 'better retention with wellbeing support',
    description: 'People stay longer when they feel supported by leadership, culture, and access to real mental healthcare.',
    icon: FiUsers,
  },
  {
    value: '24/7',
    title: 'care pathways for urgent emotional support',
    description: 'Employees need fast, confidential access to support before challenges become crises or absenteeism.',
    icon: FiShield,
  },
  {
    value: 'ROI',
    title: 'shows up in focus, morale, and performance',
    description: 'Wellbeing is not a perk. It is an operating advantage for teams under constant change.',
    icon: FiTrendingUp,
  },
];

const employeeSupport = [
  'Confidential one-to-one therapy with multilingual psychologists',
  'Stress, burnout, anxiety, and adjustment support for modern teams',
  'Relationship, family, and expatriate mental health guidance',
  'Flexible online sessions for UAE and GCC employees across time zones',
  'Fast WhatsApp-based intake for discreet support access',
];

const organisationSupport = [
  'Custom employee wellbeing programs shaped to your workforce',
  'Manager and leadership training for emotionally safer teams',
  'Mental health workshops, awareness campaigns, and psychoeducation',
  'Referral pathways for higher-risk or high-need employee cases',
  'Quarterly support planning for HR, founders, and people teams',
];

const programPillars = [
  {
    title: 'Early Support',
    description: 'Give employees a safe place to talk before stress becomes absence, conflict, or disengagement.',
    icon: FiHeart,
  },
  {
    title: 'Culturally Aware Care',
    description: 'MindGood matches people with clinicians who understand multilingual, multicultural, and expat realities.',
    icon: FiMessageSquare,
  },
  {
    title: 'Manager Enablement',
    description: 'Equip leaders to spot warning signs, respond better, and build trust without overstepping clinical boundaries.',
    icon: FiBriefcase,
  },
];

const testimonials = [
  {
    quote:
      'The strongest shift was not just utilisation. Managers became more confident having difficult wellbeing conversations early.',
    author: 'People Operations Lead',
  },
  {
    quote:
      'Our team wanted practical support, not generic wellness content. MindGood made the program feel human and regionally relevant.',
    author: 'Founder, UAE-based startup',
  },
  {
    quote:
      'Employees appreciated being able to speak in the language they were most comfortable with. That changed uptake completely.',
    author: 'HR Business Partner',
  },
];

export const metadata: Metadata = {
  title: 'Corporate Wellbeing Partnerships for UAE & GCC Teams',
  description:
    'Partner with MindGood for corporate mental health and employee wellbeing programs across Dubai, the UAE, and the GCC. WhatsApp us for corporate collaboration.',
  keywords: [
    'corporate mental health UAE',
    'employee wellbeing Dubai',
    'corporate counselling UAE',
    'workplace wellness GCC',
    'mental health workshops Dubai',
    'employee assistance program UAE',
    'corporate collaboration MindGood',
  ],
  alternates: {
    canonical: `${siteUrl}/corporate`,
  },
  openGraph: {
    title: 'Corporate Wellbeing Partnerships for UAE & GCC Teams',
    description:
      'MindGood helps organisations build healthier, more resilient teams through confidential therapy, leadership training, and custom wellbeing programs.',
    url: `${siteUrl}/corporate`,
    siteName: 'MindGood',
    type: 'website',
  },
};

export default function CorporatePage() {
  return (
    <div className="bg-[linear-gradient(180deg,#f5fffb_0%,#ffffff_22%,#ecfeff_100%)] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.18),_transparent_42%),radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_35%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-teal-100 bg-white/85 p-8 shadow-[0_30px_100px_rgba(15,118,110,0.12)] backdrop-blur md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                  Corporate wellbeing partnerships for UAE and GCC teams
                </div>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                  Employee wellbeing is not an expense. It is infrastructure for sustainable performance.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  MindGood partners with HR teams, founders, schools, clinics, and people leaders to deliver confidential mental health support that feels clinically sound, culturally aware, and easy for employees to use.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-base font-bold text-white transition-transform hover:scale-[1.02]"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    WhatsApp for Corporate Collab
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:text-teal-700"
                  >
                    Speak to Our Team
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {workplaceStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="rounded-[1.75rem] border border-slate-100 bg-slate-50/80 p-5 shadow-sm"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-3xl font-black text-slate-950">{stat.value}</div>
                      <h2 className="mt-2 text-lg font-bold text-slate-900">{stat.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{stat.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">Why companies reach out</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            Modern teams need more than a once-a-year wellness talk
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Workplace pressure shows up as burnout, lower focus, interpersonal strain, presenteeism, and avoidable attrition. We help organisations respond with support that employees will actually trust and use.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {programPillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.title}
                className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-black text-slate-950">{pillar.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-600">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">For employees</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Care that feels private, practical, and easy to access</h2>
            <div className="mt-8 space-y-4">
              {employeeSupport.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FiCheck className="mt-1 h-5 w-5 shrink-0 text-teal-300" />
                  <p className="text-base leading-7 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-teal-100 bg-teal-50 p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">For organisations</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Programs designed around your team, not copied from a template</h2>
            <div className="mt-8 space-y-4">
              {organisationSupport.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FiCheck className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
                  <p className="text-base leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">What collaboration can include</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Built for lean people teams and growing organisations</h2>
            <div className="mt-8 space-y-5 text-slate-600">
              <div className="flex items-start gap-4">
                <FiBarChart2 className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
                <p className="leading-7">Program planning for onboarding periods, high-pressure seasons, or culture-change initiatives.</p>
              </div>
              <div className="flex items-start gap-4">
                <FiUsers className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
                <p className="leading-7">Psychoeducation sessions for employees, parents, students, managers, and leadership teams.</p>
              </div>
              <div className="flex items-start gap-4">
                <FiShield className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
                <p className="leading-7">Confidential care pathways that respect privacy while helping HR teams support employees responsibly.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-100 bg-gradient-to-br from-white to-cyan-50 p-6 shadow-sm"
              >
                <p className="text-base leading-7 text-slate-700">“{item.quote}”</p>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">{item.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-teal-900 to-cyan-900 p-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:p-14">
          <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-teal-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-200">Corporate collab</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Planning a corporate wellbeing initiative?
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                Message us on WhatsApp to discuss team size, goals, audience, and the kind of support your organisation needs. We’ll help shape the right collaboration model.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-base font-bold text-slate-950 transition-transform hover:scale-[1.02]"
              >
                <FaWhatsapp className="h-5 w-5 text-[#25D366]" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${supportPhone}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Call {supportPhone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
