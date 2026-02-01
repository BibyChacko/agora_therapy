import Link from "next/link";

const fears = [
  { from: "Scared of nights", to: "Scared of being a failure" },
  { from: "Scared of ghosts", to: "Scared of being a burden" },
  { from: "Scared of the dark", to: "Scared of not being enough" },
  { from: "Scared of monsters", to: "Scared of being misunderstood" },
  { from: "Scared of being alone", to: "Scared of being unloved" },
  { from: "Scared of loud noises", to: "Scared of being weak" },
  { from: "Scared of strangers", to: "Scared of disappointment" },
  { from: "Scared of separation", to: "Scared of abandonment" }
];

export function EmotionalJourneySection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            We Carry More Than We Show
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            From childhood to now, our fears evolve but the weight remains. 
            Whatever baggage, trauma, or scars you carry—<span className="font-semibold text-teal-600 dark:text-teal-400">we are here with you</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          {fears.map((fear, index) => (
            <div 
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 italic">
                    {fear.from}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="text-base font-medium text-gray-900 dark:text-white">
                      {fear.to}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto opacity-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.22l-.61-.6a5.5 5.5 0 00-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 00-7.78-7.77l-.61.61z" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              We Are Here With You
            </h3>
            <p className="text-lg md:text-xl mb-6 opacity-95 leading-relaxed">
              Hugging you tightly. Being with you. Hearing you. 
              <br className="hidden md:block" />
              You don&apos;t have to carry it all alone anymore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                href="/psychologists"
                className="px-8 py-3 bg-white text-teal-600 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Talk to Someone Today
              </Link>
              <Link 
                href="/services"
                className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Support Options
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your journey is unique, and so is your healing. Our therapists understand the weight of unspoken fears 
            and are trained to help you navigate through them with compassion and expertise.
          </p>
        </div>
      </div>
    </section>
  );
}
