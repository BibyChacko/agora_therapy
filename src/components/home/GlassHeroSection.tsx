import Link from "next/link";
import { FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';

export function GlassHeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* 24/7 Badge */}
            <div className="inline-flex items-center gap-3 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/90 dark:border-gray-700/90 rounded-full px-4 py-2 shadow-lg w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">24/7</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Dubai, UAE & GCC</p>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Online Therapy for
              <span className="block bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Dubai, UAE & GCC
              </span>
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 md:text-xl">
              Find a licensed therapist who matches your language, goals, and schedule. Start with a quick browse or see how the process works before you book.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="#therapists"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-teal-500 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              >
                Find Your Therapist
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 bg-white/70 px-7 py-4 text-base font-semibold text-gray-900 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:border-gray-700/80 dark:bg-gray-800/70 dark:text-white dark:hover:bg-gray-800/90"
              >
                How It Works
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true"></span>
                <span>Private and confidential support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden="true"></span>
                <span>Browse by language and specialty</span>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  title: "Licensed Psychologists",
                  description: "Connect with multilingual therapists who understand expat and regional mental health needs"
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: "Support That Fits Your Life",
                  description: "Evidence-based care for anxiety, relationships, burnout, stress, and life transitions"
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: "Confidential Online Sessions",
                  description: "Private therapy for individuals, couples, and families across the UAE and GCC"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-2xl p-5 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Video/Image Card */}
          <div className="relative">
            <div className="backdrop-blur-md bg-white/40 dark:bg-gray-800/40 border border-white/60 dark:border-gray-700/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/5] relative">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/video/mindgood_intro.mp4" type="video/mp4" />
                </video>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Bottom info card */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="pr-0 sm:pr-4">
                        <p className="text-white font-semibold text-base sm:text-lg">Follow Mindgood</p>
                        <p className="mt-1 text-sm leading-6 text-white/90">
                          Stay connected for mental wellness tips, updates, and new resources across our social channels.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <Link 
                          href="https://www.instagram.com/mindgood.life/" 
                          target="_blank" 
                          rel="noreferrer"
                          aria-label="Follow Mindgood on Instagram"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-pink-600 shadow-lg transition-all hover:scale-110 hover:bg-white"
                        >
                          <FaInstagram className="w-5 h-5" />
                        </Link>
                        <Link 
                          href="https://www.linkedin.com/company/mind-good/posts/" 
                          target="_blank" 
                          rel="noreferrer"
                          aria-label="Follow Mindgood on LinkedIn"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0077b5] shadow-lg transition-all hover:scale-110 hover:bg-white"
                        >
                          <FaLinkedin className="w-5 h-5" />
                        </Link>
                        <Link 
                          href="#" 
                          aria-label="Visit Mindgood on YouTube"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#FF0000] shadow-lg transition-all hover:scale-110 hover:bg-white"
                        >
                          <FaYoutube className="w-5 h-5" />
                        </Link>
                        <Link 
                          href="#" 
                          aria-label="Visit Mindgood on TikTok"
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-all hover:scale-110 hover:bg-white"
                        >
                          <FaTiktok className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

    
          </div>
        </div>
      </div>
    </section>
  );
}
