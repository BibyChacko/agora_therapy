"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How does online therapy work?",
    answer: "Our online therapy platform connects you with licensed therapists through secure video calls, chat, or phone sessions. Simply browse our therapists, book a session that fits your schedule, and connect from the comfort of your home. All sessions are confidential and HIPAA-compliant."
  },
  {
    question: "What is the difference between a therapist and a counselor?",
    answer: "While both provide mental health support, therapists typically have advanced degrees (Master's or Doctorate) and can diagnose mental health conditions. Counselors often focus on specific life challenges. All our professionals are licensed and qualified to provide evidence-based treatment."
  },
  {
    question: "How much does a therapy session cost?",
    answer: "Our sessions start from $50 USD for a one-hour session. Pricing may vary based on the therapist's specialization and experience. We accept various payment methods including credit cards, debit cards, Apple Pay, and Google Pay. Many insurance plans also cover online therapy."
  },
  {
    question: "Can I switch therapists if needed?",
    answer: "Absolutely! Finding the right therapeutic fit is crucial for your progress. You can switch therapists at any time without any penalties. We encourage you to find a professional you feel comfortable with and trust."
  },
  {
    question: "Is my information kept confidential?",
    answer: "Yes, complete confidentiality is our priority. All sessions and communications are encrypted and HIPAA-compliant. Your therapist is bound by professional ethics and legal requirements to maintain confidentiality, except in rare cases where there's a risk of harm."
  }
];

export function GlassFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image */}
            <div className="relative">
              <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=1000&fit=crop"
                    alt="Need Help"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Overlay text */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-white text-3xl font-bold mb-2">
                      Need any help? Don&apos;t worry.
                    </h3>
                    <p className="text-white/90 text-lg">
                      We&apos;re here to support you 24/7
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating contact card */}
              <div className="absolute -bottom-6 -right-6 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/90 dark:border-gray-700/90 rounded-2xl p-6 shadow-2xl max-w-xs">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Get instant support via WhatsApp
                </p>
                <a
                  href="https://wa.me/971505134930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat Now
                </a>
              </div>
            </div>

            {/* Right - FAQ */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                Common Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >
                      <span className="font-semibold text-lg text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
