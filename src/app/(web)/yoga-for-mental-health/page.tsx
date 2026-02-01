import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Yoga for Mental Health | Online Yoga Sessions for Anxiety, Depression & Stress',
  description: 'Discover how yoga improves mental health. Join our online yoga sessions designed for anxiety relief, depression management, and stress reduction. Science-backed practices led by experienced instructors.',
  keywords: [
    'yoga for mental health',
    'yoga for anxiety',
    'yoga for depression',
    'online yoga sessions',
    'stress relief yoga',
    'mindfulness yoga',
    'therapeutic yoga',
    'yoga therapy',
    'mental wellness yoga',
    'yoga for stress management',
    'meditation and yoga',
    'yoga for emotional health'
  ],
  openGraph: {
    title: 'Yoga for Mental Health | Online Yoga Sessions',
    description: 'Science-backed yoga practices for anxiety, depression, and stress. Join our online sessions led by experienced instructors.',
    type: 'website',
  },
};

export default function YogaForMentalHealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <svg className="w-24 h-24 text-purple-600 dark:text-purple-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Yoga for Mental Health
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your mind, heal your emotions, and find inner peace through the ancient practice of yoga.
          </p>
        </div>

        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-1 mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 md:p-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                How Yoga Transforms Mental Health
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center max-w-3xl mx-auto">
                Yoga is more than physical exercise—it's a holistic practice that integrates body, mind, and breath 
                to create profound mental and emotional healing.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Physical Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Releases physical tension stored in muscles</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Regulates nervous system response</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Improves sleep quality and duration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Balances hormones and neurotransmitters</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mental & Emotional Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Reduces rumination and negative thinking</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Enhances emotional regulation skills</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Builds self-awareness and mindfulness</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">Increases resilience to stress</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Scientific Evidence
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stat: '27%',
                title: 'GABA Increase',
                description: 'Yoga increases GABA levels, a neurotransmitter that reduces anxiety',
                color: 'purple'
              },
              {
                stat: '50%',
                title: 'Anxiety Reduction',
                description: 'Regular practice can reduce anxiety symptoms by up to 50%',
                color: 'indigo'
              },
              {
                stat: '73%',
                title: 'Better Sleep',
                description: 'Participants report significant improvements in sleep quality',
                color: 'violet'
              },
            ].map((item, index) => (
              <div key={index} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 dark:from-${item.color}-900/20 dark:to-${item.color}-800/20 rounded-2xl p-8 border border-${item.color}-200 dark:border-${item.color}-800`}>
                <div className={`text-5xl font-bold text-${item.color}-600 dark:text-${item.color}-400 mb-3`}>{item.stat}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Yoga Practices for Specific Mental Health Conditions
          </h2>
          <div className="space-y-6">
            {[
              {
                condition: 'Anxiety & Panic Disorders',
                practices: ['Gentle Hatha Yoga', 'Restorative Yoga', 'Pranayama (Breathing Exercises)', 'Yoga Nidra'],
                benefits: 'Calms the nervous system, reduces physical symptoms of anxiety, teaches breath control during panic',
                color: 'blue'
              },
              {
                condition: 'Depression',
                practices: ['Vinyasa Flow', 'Backbends', 'Sun Salutations', 'Heart-Opening Poses'],
                benefits: 'Boosts energy levels, increases serotonin, combats lethargy, improves mood',
                color: 'green'
              },
              {
                condition: 'PTSD & Trauma',
                practices: ['Trauma-Sensitive Yoga', 'Grounding Poses', 'Gentle Movement', 'Body Awareness'],
                benefits: 'Reconnects with body safely, processes stored trauma, builds sense of safety',
                color: 'amber'
              },
              {
                condition: 'Stress & Burnout',
                practices: ['Yin Yoga', 'Meditation', 'Restorative Poses', 'Guided Relaxation'],
                benefits: 'Activates relaxation response, reduces cortisol, promotes deep rest and recovery',
                color: 'purple'
              },
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.condition}</h3>
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommended Practices:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.practices.map((practice, idx) => (
                          <span key={idx} className={`text-xs px-3 py-1 bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-800 dark:text-${item.color}-300 rounded-full`}>
                            {practice}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Benefits:</strong> {item.benefits}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Online Yoga Programs
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Live Interactive Sessions</h3>
              <p className="mb-6 opacity-95">
                Join real-time classes with experienced yoga instructors who specialize in mental health and therapeutic yoga.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Small group sizes for personalized attention</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Real-time feedback and adjustments</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Multiple time slots to fit your schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Community support and connection</span>
                </li>
              </ul>
              <div className="text-3xl font-bold mb-2">Starting at $29/month</div>
              <p className="text-sm opacity-90">Unlimited live sessions included</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">On-Demand Video Library</h3>
              <p className="mb-6 opacity-95">
                Access hundreds of pre-recorded yoga sessions designed for mental wellness. Practice anytime, anywhere.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sessions from 10 to 60 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Beginner to advanced levels</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Condition-specific programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>New content added weekly</span>
                </li>
              </ul>
              <div className="text-3xl font-bold mb-2">Starting at $19/month</div>
              <p className="text-sm opacity-90">Full library access</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-10 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Combine Yoga with Professional Therapy</h3>
            <p className="text-lg mb-6 opacity-95 max-w-2xl mx-auto">
              For the most comprehensive mental health support, combine our yoga programs with one-on-one therapy sessions. 
              Many of our therapists integrate yoga principles into their practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/psychologists"
                className="px-10 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Find a Therapist
              </Link>
              <Link 
                href="/services"
                className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Getting Started with Yoga for Mental Health
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Choose Your Path', desc: 'Select live sessions, on-demand videos, or both' },
              { step: 2, title: 'Start Slow', desc: 'Begin with beginner-friendly classes and build gradually' },
              { step: 3, title: 'Be Consistent', desc: 'Practice 3-4 times per week for best results' },
              { step: 4, title: 'Track Progress', desc: 'Notice improvements in mood, sleep, and stress levels' },
            ].map((item) => (
              <div key={item.step} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 text-lg">Important Note</h3>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              While yoga is a powerful tool for mental health, it's not a replacement for professional mental health treatment. 
              If you're experiencing severe depression, anxiety, or other mental health conditions, please consult with a 
              licensed therapist or mental health professional. Yoga works best as a complementary practice alongside 
              professional care.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
