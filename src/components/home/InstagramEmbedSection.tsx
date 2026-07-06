import Script from "next/script";

export function InstagramEmbedSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-pink-50/40 dark:from-gray-950 dark:to-gray-900/80">
      <Script async src="https://www.instagram.com/embed.js" strategy="lazyOnload" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-12">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-pink-600 dark:text-pink-400">
              From Instagram
            </p>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white md:text-5xl">
              Real Moments From MindGood
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 md:text-lg">
              A quick look at the stories and support we share with our community.
            </p>
          </div>

          <div className="flex justify-center">
            <div
              className="w-full max-w-[540px]"
              dangerouslySetInnerHTML={{
                __html: `
                  <blockquote
                    class="instagram-media"
                    data-instgrm-captioned
                    data-instgrm-permalink="https://www.instagram.com/reel/DaGElWNtHao/?utm_source=ig_embed&amp;utm_campaign=loading"
                    data-instgrm-version="14"
                    style="background:#FFF; border:0; border-radius:24px; box-shadow:0 18px 48px rgba(0,0,0,0.12); margin:0 auto; max-width:540px; min-width:326px; padding:0; width:100%;"
                  >
                    <a
                      href="https://www.instagram.com/reel/DaGElWNtHao/?utm_source=ig_embed&amp;utm_campaign=loading"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View this post on Instagram
                    </a>
                  </blockquote>
                `,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
