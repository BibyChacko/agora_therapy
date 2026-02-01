import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take the First Step?</h2>
          <p className="text-lg mb-8 opacity-90">
            Connect with a psychologist who understands your language and culture. Start your journey to better mental health today.
          </p>
          <Link 
            href="/psychologists"
            className="inline-block px-8 py-4 bg-white text-teal-600 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Find Your Psychologist
          </Link>
        </div>
      </div>
    </section>
  );
}
