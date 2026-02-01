import Link from "next/link";

export function SupportHandSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-600/5 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-12 flex items-center justify-center">
                  <svg 
                    className="w-48 h-48 text-teal-600 dark:text-teal-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" 
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                You Don&apos;t Have to Fight Your Battles Alone
              </h2>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  In the quiet moments when the weight feels unbearable, when the struggle seems endless, 
                  remember this—<span className="font-semibold text-teal-600 dark:text-teal-400">you are not alone</span>.
                </p>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  I lean my hand towards you, ready to hold yours. Not to pull you out of your darkness, 
                  but to sit with you in it. To remind you that strength isn&apos;t about fighting alone—it&apos;s 
                  about having the courage to reach back.
                </p>

                <div className="bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500 p-6 rounded-r-lg">
                  <p className="text-base italic text-gray-800 dark:text-gray-200">
                    &ldquo;Sometimes the bravest thing you can do is let someone walk beside you.&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/psychologists"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity text-center shadow-lg"
                >
                  Take My Hand
                </Link>
                <Link 
                  href="/services"
                  className="px-8 py-4 rounded-full border-2 border-teal-500 text-teal-600 dark:text-teal-400 font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trained therapists ready to listen</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Available 24/7</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Support when you need it most</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Safe & Confidential</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your privacy is our priority</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
