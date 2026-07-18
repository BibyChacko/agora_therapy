import { Metadata } from 'next';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiAlertCircle,
  FiArrowRight,
  FiBookOpen,
  FiCheck,
  FiCompass,
  FiHeart,
  FiLayers,
  FiMessageSquare,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { siteUrl, supportPhone } from '@/lib/seo';

const whatsappNumber = '971505134930';
const whatsappMessage = encodeURIComponent(
  'Hello MindGood, I would like to discuss a campus association for student wellbeing support.'
);
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

const campusStats = [
  {
    value: '1 in 3',
    title: 'students report anxiety or low mood',
    description: 'Academic pressure, identity development, family expectations, and career uncertainty often collide at once.',
    icon: FiHeart,
  },
  {
    value: '40%+',
    title: 'drop in engagement can be stress-related',
    description: 'When emotional wellbeing dips, attendance, concentration, confidence, and academic persistence usually follow.',
    icon: FiTrendingUp,
  },
  {
    value: '24/7',
    title: 'access matters for vulnerable students',
    description: 'Students need support that is private, easy to reach, and available beyond office hours or exam periods.',
    icon: FiShield,
  },
  {
    value: 'Early',
    title: 'intervention protects campus life',
    description: 'Support is most effective before distress turns into crisis, withdrawal, or long-term disengagement.',
    icon: FiAlertCircle,
  },
];

const studentSupport = [
  'Confidential one-to-one therapy with youth-sensitive psychologists',
  'Support for anxiety, stress, loneliness, self-worth, and adjustment challenges',
  'Career, family, and identity-focused counselling for school and university students',
  'Workshops on emotional regulation, resilience, relationships, and exam stress',
  'WhatsApp-first intake that feels private and easy to use',
];

const institutionSupport = [
  'Campus wellbeing programs tailored to schools, colleges, and universities',
  'Faculty and staff sensitisation sessions for early recognition and safer response',
  'Referral pathways for high-need students who require more structured support',
  'Psychoeducation campaigns during onboarding, exams, and transition periods',
  'Flexible program planning for student affairs, counselling teams, and leadership',
];

const planTiers = [
  {
    name: 'Starter Support',
    bestFor: 'Schools, pilot programs, or small student communities',
    features: [
      'Awareness session and intake pathway setup',
      'Monthly student group support session',
      'WhatsApp coordination for easy access',
    ],
    tone: 'from-white to-teal-50',
  },
  {
    name: 'Core Campus Care',
    bestFor: 'Growing colleges and active student wellbeing teams',
    features: [
      'Individual therapy access for referred students',
      'Faculty sensitisation or red-flag response workshop',
      'Structured wellbeing calendar support',
    ],
    tone: 'from-teal-600 to-cyan-600',
  },
  {
    name: 'Comprehensive Program',
    bestFor: 'Universities and institutions building long-term wellbeing systems',
    features: [
      'Leadership planning and annual wellbeing roadmap',
      'Student life-skill modules and multi-format workshops',
      'Review insights for program refinement and scaling',
    ],
    tone: 'from-slate-950 to-teal-900',
  },
];

const outcomes = [
  'Better student trust in support systems when access feels discreet and culturally aware',
  'Earlier intervention for students navigating stress, homesickness, identity, or family pressure',
  'More confident staff responses to warning signs without expecting faculty to act like clinicians',
  'A stronger campus culture around care, belonging, and help-seeking',
];

export const metadata: Metadata = {
  title: 'Campus Wellbeing Partnerships for Schools, Colleges & Universities',
  description:
    'Partner with MindGood for campus mental health and student wellbeing support across schools, colleges, and universities in the UAE and GCC.',
  keywords: [
    'campus counselling UAE',
    'student wellbeing Dubai',
    'school mental health program UAE',
    'university counselling partnership GCC',
    'student mental health support Dubai',
    'campus association MindGood',
  ],
  alternates: {
    canonical: `${siteUrl}/campus`,
  },
  openGraph: {
    title: 'Campus Wellbeing Partnerships for Schools, Colleges & Universities',
    description:
      'MindGood supports schools, colleges, and universities with student-focused therapy access, workshops, and campus wellbeing partnerships.',
    url: `${siteUrl}/campus`,
    siteName: 'MindGood',
    type: 'website',
  },
};

export default function CampusPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_24%,#f0fdfa_100%)] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.16),_transparent_38%)]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-amber-100 bg-white/90 p-8 shadow-[0_30px_100px_rgba(13,148,136,0.12)] backdrop-blur md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  Campus associations for schools, colleges, and universities
                </div>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                  A healthy mind is one of the strongest foundations for learning, belonging, and growth.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                  MindGood helps institutions build student wellbeing systems that feel approachable, clinically grounded, and relevant to today&apos;s academic and social pressures.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3 text-base font-bold text-white transition-transform hover:scale-[1.02]"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    WhatsApp for Campus Association
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-teal-300 hover:text-teal-700"
                  >
                    Talk to Our Team
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {campusStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="rounded-[1.75rem] border border-slate-100 bg-slate-50/80 p-5 shadow-sm"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
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
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">Why campuses reach out</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            Students are carrying more than coursework
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Behind attendance dips, exam stress, conflict, burnout, and withdrawal, there is often an unmet emotional need. The right support model helps students feel safer, more supported, and more able to engage with campus life.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-white">
              <FiBookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl font-black text-slate-950">Student-Centred Access</h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Reduce friction so students can reach support quickly and discreetly in the moments they actually need it.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
              <FiUsers className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl font-black text-slate-950">Institution Support</h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Help faculty, counsellors, and student affairs teams respond earlier and more confidently to signs of distress.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
              <FiCompass className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-2xl font-black text-slate-950">Long-Term Wellbeing</h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Move beyond one-off awareness sessions into a healthier, more sustainable campus care ecosystem.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-slate-950 p-8 text-white md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-300">For students</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Support that feels safe, relevant, and not intimidating</h2>
            <div className="mt-8 space-y-4">
              {studentSupport.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FiCheck className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
                  <p className="text-base leading-7 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-teal-100 bg-teal-50 p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">For institutions</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Partnership models for student wellbeing teams and leadership</h2>
            <div className="mt-8 space-y-4">
              {institutionSupport.map((item) => (
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
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">Program formats</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            Flexible models for different campus sizes
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            We can start small, support an existing counselling function, or help shape a more comprehensive annual student wellbeing program.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {planTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`rounded-[2rem] bg-gradient-to-br ${tier.tone} p-[1px] shadow-[0_20px_60px_rgba(15,23,42,0.08)]`}
            >
              <div
                className={`h-full rounded-[calc(2rem-1px)] p-8 ${
                  index === 0 ? 'bg-white' : index === 1 ? 'bg-white/8 text-white' : 'bg-white/6 text-white'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-teal-700">
                  <FiLayers className="h-5 w-5" />
                </div>
                <h3 className={`mt-6 text-2xl font-black ${index === 0 ? 'text-slate-950' : 'text-white'}`}>{tier.name}</h3>
                <p className={`mt-3 text-sm font-semibold uppercase tracking-[0.18em] ${index === 0 ? 'text-slate-500' : 'text-white/70'}`}>
                  {tier.bestFor}
                </p>
                <div className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <FiCheck className={`mt-1 h-5 w-5 shrink-0 ${index === 0 ? 'text-teal-700' : 'text-amber-300'}`} />
                      <p className={`text-base leading-7 ${index === 0 ? 'text-slate-700' : 'text-white/90'}`}>{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">What good support changes</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Outcomes that strengthen the whole campus environment</h2>
            <div className="mt-8 space-y-5 text-slate-600">
              {outcomes.map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <FiMessageSquare className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
                  <p className="leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-amber-50 via-white to-teal-50 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">Who we work with</p>
            <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Designed for institutions that want support students will actually use</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Schools', 'Colleges', 'Universities', 'Student Affairs Teams', 'Counselling Units', 'Leadership & Faculty'].map((item) => (
                <div key={item} className="rounded-2xl border border-white bg-white/80 px-5 py-4 text-base font-semibold text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 pt-16 md:pb-24 md:pt-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-teal-900 to-amber-700 p-10 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:p-14">
          <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-amber-300/20 blur-2xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">Campus association</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                Planning a student wellbeing collaboration?
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                Message us on WhatsApp to discuss your institution size, student needs, existing support structure, and the kind of campus partnership you want to build.
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
