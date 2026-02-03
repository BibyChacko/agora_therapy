import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface GlassServicesSectionProps {
  services: Service[];
}

export function GlassServicesSection({ services }: GlassServicesSectionProps) {
  const defaultIcons = ["🧠", "💙", "🌟", "🤝", "💪", "🌈", "✨", "🎯"];

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-teal-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-20 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Mental Health
            <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Support Services
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional support tailored to your unique needs. From anxiety to relationships, 
            we're here to help you thrive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/60 rounded-3xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white/70 dark:hover:bg-gray-800/70"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{service.icon || defaultIcons[index % defaultIcons.length]}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {service.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/80 dark:border-gray-700/80 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Explore All Services
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
