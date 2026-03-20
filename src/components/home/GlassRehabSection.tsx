import Link from "next/link";

export function GlassRehabSection() {
  const whatsappNumber = "971505134930";
  const whatsappMessage = encodeURIComponent(
    "Hi MindGood,\n\nI'm interested in learning more about your rehabilitation and retreat programs. I'd like to explore options for immersive healing in a supportive environment surrounded by nature and caring professionals.\n\nCould you please provide more information about available programs and how to get started?\n\nThank you!"
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">MindGood Retreats & Rehab</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your Sanctuary for
                <span className="block bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Immersive Healing
                </span>
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Step away from the noise and find your path to recovery in our specialized
                therapeutic environments designed for deep healing and personal growth.
              </p>
            </div>
          </div>

          {/* Program Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Residential Rehab</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
                Comprehensive 24/7 care in a high-end, supportive environment focused on long-term recovery and wellness.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Personalized Treatment Plans
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Multi-disciplinary Medical Team
                </li>
              </ul>
            </div>

            <div className="group backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Wellness Retreats</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
                Short-term immersive experiences designed to reset your mental health and restore inner balance.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Mindfulness & Meditation focus
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Nature Integration Programs
                </li>
              </ul>
            </div>

            <div className="group backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Support Groups</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
                Connected communal spaces where you can share experiences and grow alongside others in similar paths.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  Facilitated Group Therapy
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  Alumni Support Network
                </li>
              </ul>
            </div>
          </div>

          {/* Featured Quote / Info */}
          <div className="mt-20 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Experience Healing in Harmony with Nature
                </h3>
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                  Our rehab and retreat centers are strategically located in peaceful,
                  serene environments that promote reflection, tranquility, and natural recovery.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <span className="px-6 py-2 rounded-full border border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-800/50 text-purple-700 dark:text-purple-300 text-sm font-medium">Licensed Medical Staff</span>
                  <span className="px-6 py-2 rounded-full border border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-gray-800/50 text-blue-700 dark:text-blue-300 text-sm font-medium">Confidential Environment</span>
                  <span className="px-6 py-2 rounded-full border border-teal-200 dark:border-teal-800 bg-white/50 dark:bg-gray-800/50 text-teal-700 dark:text-teal-300 text-sm font-medium">Holistic Approach</span>
                </div>
              </div>
              <div className="w-full lg:w-1/3">
                <div className="backdrop-blur-xl bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl p-8 shadow-2xl">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">95%</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-6">Success Rate in Recovery</div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-teal-500 w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 group relative overflow-hidden rounded-[3rem] backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 border border-white/40 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-teal-600/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Take the First Step Toward Recovery</h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Consult with our experts privately to find the right program for your needs.
                We are here to support your journey 24/7.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-full font-bold text-lg hover:from-purple-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-xl group/btn"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Connect on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="px-10 py-4 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full font-bold text-lg hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-300 hover:scale-105"
                >
                  Send a Message
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Available 24/7 • Confidential Consultation • Personalized Programs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
