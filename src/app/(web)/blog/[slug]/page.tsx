import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { FiClock, FiUser, FiArrowLeft, FiMessageCircle, FiHeart, FiChevronRight } from 'react-icons/fi';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/data/blogPosts';
import { getPublicTherapists } from '@/lib/services/public-therapist-service';
import { TherapistCard } from '@/components/psychologists/TherapistCard';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import BlogLanguageSelector from '@/components/blog/BlogLanguageSelector';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blogPost = getBlogPostBySlug(slug);
  
  if (!blogPost) return { title: 'Post Not Found' };

  return {
    title: `${blogPost.title} | MindGood Blog`,
    description: blogPost.excerpt,
    openGraph: {
      title: blogPost.title,
      description: blogPost.excerpt,
      images: [blogPost.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blogPost = getBlogPostBySlug(slug);
  
  if (!blogPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-black text-gray-900 dark:text-white">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">The story you seek has wandered off the path.</p>
          <Link 
            href="/blog"
            className="inline-flex items-center px-8 py-4 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl"
          >
            <FiArrowLeft className="mr-2" /> Back to Wisdom
          </Link>
        </div>
      </div>
    );
  }

  // Fetch therapists who specialize in this blog's category - THIS NOW WORKS BECAUSE WE ARE ON THE SERVER
  const relatedTherapists = await getPublicTherapists({
    specialization: blogPost.category.toLowerCase().replace(' ', '-'),
  });
  const limitedTherapists = relatedTherapists.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#050505] transition-colors duration-500">
      <ReadingProgressBar />

      {/* Hero Header */}
      <header className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] flex items-end">
        <Image 
          src={blogPost.image} 
          alt={blogPost.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFB] via-[#FDFCFB]/40 to-transparent dark:from-[#050505] dark:via-[#050505]/40" />
        
        <div className="container relative z-10 pb-12">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                {blogPost.category}
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {blogPost.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              {blogPost.title}
            </h1>

            {/* <div className="flex items-center gap-4 pt-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg">
                <Image src={blogPost.authorImage} alt={blogPost.author} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white">{blogPost.author}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{blogPost.date}</span>
              </div>
            </div> */}
          </div>
        </div>
      </header>

      <main className="container pt-12 pb-24">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <article className="lg:col-span-8 space-y-12">
            {/* Language Selection & Interaction Bar (Client Component) */}
            <BlogLanguageSelector 
              languages={blogPost.languages} 
              initialLanguage={blogPost.languages[0]} 
            />

            {/* Content body */}
            <div 
              className="prose prose-2xl dark:prose-invert max-w-none 
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-h2:text-4xl prose-h2:mt-24 prose-h2:mb-8
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-[1.8] prose-p:mb-10
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-950/20 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:font-medium
                prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400
                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-gray-100 dark:prose-img:border-gray-800
                prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-4
                prose-lead:text-2xl prose-lead:text-gray-600 dark:prose-lead:text-gray-400 prose-lead:leading-relaxed prose-lead:mb-16"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Footer Interaction */}
            <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl font-black text-sm hover:scale-105 transition-transform">
                    <FiHeart /> 245
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl font-black text-sm hover:scale-105 transition-transform">
                    <FiMessageCircle /> 12
                  </button>
                </div>
                
                <div className="flex gap-2">
                  {['Psychology', 'Wellness', blogPost.category].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 dark:bg-gray-900 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-12">
            {/* Top Specialists Sidebar */}
            {limitedTherapists.length > 0 && (
              <div className="sticky top-32 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Top Specialists</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Experts in {blogPost.category.toLowerCase()}</p>
                </div>
                
                <div className="space-y-6">
                  {limitedTherapists.map(therapist => (
                    <div key={therapist.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                      <TherapistCard therapist={therapist} />
                    </div>
                  ))}
                </div>

                <Link 
                  href={`/psychologists?specialization=${blogPost.category.toLowerCase().replace(' ', '-')}`}
                  className="flex items-center justify-between w-full p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black transition-all group shadow-xl shadow-indigo-500/20"
                >
                  <span className="text-sm uppercase tracking-widest">Explore All Experts</span>
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Newsletter Mock */}
                <div className="p-8 bg-teal-50 dark:bg-teal-900/10 rounded-[2rem] border border-teal-100 dark:border-teal-900/30 space-y-4">
                  <h4 className="text-lg font-black text-teal-900 dark:text-teal-400 tracking-tight">Mindful Newsletter</h4>
                  <p className="text-sm text-teal-800/70 dark:text-teal-400/60 leading-relaxed font-medium">Get the latest mental health insights delivered to your inbox.</p>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="email@example.com" 
                      className="w-full p-4 pr-12 bg-white dark:bg-black border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                    />
                    <button className="absolute right-2 top-2 p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                      <FiArrowLeft className="rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Recommended Reading Footer */}
      <section className="bg-white dark:bg-gray-900/30 py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="container space-y-12">
          <div className="flex items-end justify-between">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">Continue the Journey</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Recommended Reading</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 font-black text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest text-xs">
              View All Posts <FiChevronRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {getRelatedPosts(slug, blogPost.category, 3).map((post) => (
              <Link 
                href={`/blog/${post.id}`} 
                key={post.id} 
                className="group space-y-6"
              >
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="px-2 space-y-3">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
