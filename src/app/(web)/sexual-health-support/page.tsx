import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sexual Health & Compulsive Behavior Support | Professional Therapy',
  description: 'Get professional help for compulsive sexual behaviors, pornography addiction, and excessive masturbation. Evidence-based therapy with licensed specialists. Confidential online support available 24/7.',
  keywords: [
    'pornography addiction therapy',
    'compulsive sexual behavior',
    'masturbation addiction help',
    'sexual health counseling',
    'porn addiction recovery',
    'sexual compulsion treatment',
    'behavioral addiction therapy',
    'online sex therapy',
    'quit pornography',
    'sexual addiction recovery',
    'CBT for sexual behaviors',
    'confidential sex therapy'
  ],
  openGraph: {
    title: 'Sexual Health & Compulsive Behavior Support | Professional Therapy',
    description: 'Professional help for compulsive sexual behaviors. Evidence-based therapy with licensed specialists. Confidential online support.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SexualHealthSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Breaking Free from Compulsive Sexual Behaviors
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Professional, confidential support for overcoming pornography addiction, 
            excessive masturbation, and other compulsive sexual behaviors.
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-12">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">Important Note</h3>
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                This page addresses compulsive and problematic sexual behaviors that interfere with daily life. 
                Masturbation itself is a normal, healthy behavior. We focus on patterns that cause distress, 
                guilt, or negatively impact relationships and functioning.
              </p>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Understanding Compulsive Sexual Behaviors
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Compulsive sexual behaviors (CSB), including excessive pornography use and masturbation, 
              can develop into patterns that feel impossible to control. These behaviors often serve as 
              coping mechanisms for stress, anxiety, loneliness, or other emotional challenges.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              When these behaviors become compulsive, they can lead to significant negative consequences 
              in various areas of life, including relationships, work performance, mental health, and self-esteem.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Signs You May Need Support
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Loss of Control',
                description: 'Repeated unsuccessful attempts to reduce or stop the behavior despite wanting to.',
                icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              },
              {
                title: 'Time Consumption',
                description: 'Spending excessive amounts of time engaging in or thinking about sexual activities.',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              },
              {
                title: 'Negative Impact',
                description: 'Interference with work, studies, relationships, or other important activities.',
                icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
              },
              {
                title: 'Emotional Distress',
                description: 'Persistent feelings of guilt, shame, anxiety, or depression related to the behavior.',
                icon: 'M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              },
              {
                title: 'Escalation',
                description: 'Needing more frequent or intense stimulation to achieve the same effect.',
                icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
              },
              {
                title: 'Relationship Problems',
                description: 'Decreased intimacy, trust issues, or conflicts with partners.',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
              },
            ].map((sign, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sign.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{sign.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{sign.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Potential Negative Effects
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Mental Health
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Increased anxiety and depression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Low self-esteem and self-worth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Chronic guilt and shame</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Social isolation and withdrawal</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Relationships
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Reduced emotional intimacy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Decreased sexual satisfaction with partner</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Trust and communication issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Potential relationship breakdown</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  Daily Life
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Decreased productivity at work/school</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Fatigue and low energy levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Neglect of responsibilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Loss of interest in hobbies and activities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Evidence-Based Treatment Approaches
          </h2>
          <div className="space-y-6">
            {[
              {
                title: 'Cognitive Behavioral Therapy (CBT)',
                description: 'Identifies and changes thought patterns and behaviors that contribute to compulsive sexual activities. Helps develop healthier coping mechanisms and addresses underlying triggers.',
                color: 'blue'
              },
              {
                title: 'Acceptance and Commitment Therapy (ACT)',
                description: 'Focuses on accepting difficult thoughts and feelings while committing to behavior changes aligned with personal values. Builds psychological flexibility and mindfulness.',
                color: 'green'
              },
              {
                title: 'Mindfulness-Based Interventions',
                description: 'Teaches awareness of urges and triggers without acting on them. Develops the ability to observe thoughts and feelings without judgment, reducing automatic responses.',
                color: 'purple'
              },
              {
                title: 'Relapse Prevention Therapy',
                description: 'Identifies high-risk situations, develops coping strategies, and creates action plans for managing urges. Focuses on long-term recovery and sustainable change.',
                color: 'indigo'
              },
              {
                title: 'Couples/Relationship Therapy',
                description: 'When appropriate, involves partners in the healing process. Rebuilds trust, improves communication, and addresses relationship dynamics affected by the behavior.',
                color: 'rose'
              },
            ].map((treatment, index) => (
              <div key={index} className={`bg-${treatment.color}-50 dark:bg-${treatment.color}-900/20 border-l-4 border-${treatment.color}-500 p-6 rounded-r-lg`}>
                <h3 className={`text-xl font-bold text-${treatment.color}-900 dark:text-${treatment.color}-200 mb-3`}>
                  {treatment.title}
                </h3>
                <p className={`text-${treatment.color}-800 dark:text-${treatment.color}-300`}>
                  {treatment.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Steps to Recovery
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Acknowledge', desc: 'Recognize the problem and its impact on your life' },
              { step: 2, title: 'Seek Help', desc: 'Connect with a qualified therapist who specializes in this area' },
              { step: 3, title: 'Commit', desc: 'Engage fully in therapy and follow your treatment plan' },
              { step: 4, title: 'Sustain', desc: 'Maintain progress with ongoing support and healthy habits' },
            ].map((item) => (
              <div key={item.step} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Life?</h2>
            <p className="text-lg mb-8 opacity-95 max-w-2xl mx-auto">
              Recovery is possible. Our specialized therapists provide confidential, non-judgmental support 
              to help you break free from compulsive patterns and build a healthier relationship with yourself.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/psychologists?specialization=sexual-health"
                className="px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Find a Specialist Now
              </Link>
              <Link 
                href="/services"
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              >
                Explore All Services
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is my information kept confidential?',
                a: 'Absolutely. All therapy sessions and personal information are completely confidential and protected by professional ethics and privacy laws. Your privacy is our top priority.'
              },
              {
                q: 'How long does treatment typically take?',
                a: 'Treatment duration varies based on individual circumstances. Some people see improvement in a few months, while others benefit from longer-term support. Your therapist will work with you to create a personalized treatment plan.'
              },
              {
                q: 'Can I do therapy online?',
                a: 'Yes! Our platform offers secure, confidential online therapy sessions that you can access from anywhere in the world. This provides flexibility and privacy for your recovery journey.'
              },
              {
                q: 'Will my partner need to be involved?',
                a: 'Not necessarily. Individual therapy is often the starting point. Couples therapy may be recommended later if appropriate and if both partners are willing. The focus is on your recovery and well-being.'
              },
              {
                q: 'What if I relapse?',
                a: 'Relapse can be part of the recovery process. Your therapist will help you develop relapse prevention strategies and, if it occurs, work with you to understand what happened and get back on track without judgment.'
              },
            ].map((faq, index) => (
              <details key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 group">
                <summary className="font-bold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 text-lg">Remember</h3>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              Seeking help is a sign of strength, not weakness. Compulsive sexual behaviors are treatable, 
              and thousands of people have successfully overcome them with professional support. You deserve 
              to live a life free from shame and compulsion. Take the first step today.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
