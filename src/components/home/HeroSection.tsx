import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-teal-500/10 to-blue-600/10 dark:from-teal-900/20 dark:to-blue-900/20 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Mental Health Support in <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Your Language</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Connect with professional psychologists who speak Malayalam, Tamil, Hindi, Telugu, and Kannada. Get support for job stress, career building, family issues, and learning disabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/psychologists" 
                className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity text-center"
              >
                Find a Psychologist
              </Link>
              <Link 
                href="/services" 
                className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/hero-image.webp" 
                alt="Psychologist session" 
                width={600} 
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
