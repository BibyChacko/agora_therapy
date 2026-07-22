import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiUser, FiTag, FiShield } from 'react-icons/fi';
import { getBlogPosts } from '@/lib/data/blogPosts';
import { getLanguageName } from '@/lib/constants/languages';

function formatDisplayDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat('en-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export const metadata: Metadata = {
  title: 'Mental Health Blog | MindGood',
  description: 'Explore articles on mental health topics written by our expert psychologists in multiple languages including Malayalam, Tamil, Hindi, Telugu, and Kannada.',
  keywords: 'mental health blog, psychology articles, multilingual mental health resources, Indian languages',
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Mental Health Blog</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Expert insights, tips, and resources on mental health topics in multiple languages.
        </p>
      </div>
      
      {/* Featured Post */}
      <div className="mb-16">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto">
              <Image 
                src={blogPosts[0].image} 
                alt={blogPosts[0].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <FiClock className="mr-1" />
                <span className="mr-4">{formatDisplayDate(blogPosts[0].publishedAt)}</span>
                <FiUser className="mr-1" />
                <span>{blogPosts[0].author.name}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {blogPosts[0].title}
              </h2>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {blogPosts[0].excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full">
                  <FiTag className="mr-1" /> {blogPosts[0].category}
                </span>
                {blogPosts[0].languages.map((lang) => (
                  <span 
                    key={lang}
                    className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                  >
                    {getLanguageName(lang)}
                  </span>
                ))}
              </div>

              <div className="mb-6 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-gray-800/60 dark:text-gray-300">
                <div className="font-semibold text-gray-900 dark:text-white">Why this was created</div>
                <p className="mt-1">{blogPosts[0].whyCreated}</p>
              </div>
              
              <Link 
                href={`/blog/${blogPosts[0].id}`}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Read Full Article
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post) => (
          <div 
            key={post.id}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image 
                src={post.image} 
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <FiClock className="mr-1" />
                <span className="mr-3">{post.readTime}</span>
                <span>{formatDisplayDate(post.publishedAt)}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {post.title}
              </h3>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full">
                  <FiTag className="mr-1" /> {post.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {post.author.name}
                  </div>
                  {post.reviewer ? (
                    <div className="mt-1 inline-flex items-center gap-1 text-xs text-sky-700 dark:text-sky-300">
                      <FiShield className="h-3.5 w-3.5" />
                      Reviewed by {post.reviewer.name}
                    </div>
                  ) : null}
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  {post.languages.slice(0, 2).map((lang) => (
                    <span 
                      key={lang}
                      className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                    >
                      {getLanguageName(lang)}
                    </span>
                  ))}
                  {post.languages.length > 2 && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                      +{post.languages.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              <Link 
                href={`/blog/${post.id}`}
                className="block w-full mt-4 py-2 text-center text-teal-600 dark:text-teal-400 border border-teal-600 dark:border-teal-400 rounded-md hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-colors"
              >
                Read Article
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Newsletter Signup */}
      <div className="mt-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl p-8 md:p-12 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="opacity-90">
              Get the latest mental health resources, tips, and articles delivered directly to your inbox.
            </p>
          </div>
          
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <select className="px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white">
              <option value="en">English</option>
              <option value="ml">Malayalam</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-teal-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-sm text-center mt-4 opacity-80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
