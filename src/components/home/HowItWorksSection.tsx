const steps = [
  {
    title: 'Find Your Match',
    description: 'Browse our directory of psychologists and filter by language, specialization, and availability.'
  },
  {
    title: 'Book a Session',
    description: 'Schedule a consultation through our integrated Calendly system at a time that works for you.'
  },
  {
    title: 'Start Your Journey',
    description: 'Connect with your psychologist via secure video call and begin your path to better mental health.'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Getting started with MindGood is simple and straightforward.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
