import { getPublicTherapists } from "@/lib/services/public-therapist-service";
import { TherapistPublicView } from "@/types/models/therapist";

export interface BlogReference {
  title: string;
  source: string;
  href: string;
}

interface BlogContributorConfig {
  profileSlug?: string;
  fallbackName: string;
  fallbackRole: string;
  fallbackCredentials?: string;
}

export interface BlogPostDefinition {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  lastReviewedAt: string;
  category: string;
  readTime: string;
  languages: string[];
  author: BlogContributorConfig;
  reviewer?: BlogContributorConfig;
  whyCreated: string;
  references: BlogReference[];
  content: string;
}

export interface ResolvedBlogContributor {
  name: string;
  role: string;
  credentials?: string;
  profileSlug?: string;
  image?: string;
  languages?: string[];
}

export interface ResolvedBlogPost extends Omit<BlogPostDefinition, "author" | "reviewer"> {
  author: ResolvedBlogContributor;
  reviewer?: ResolvedBlogContributor;
}

function buildContributor(
  config: BlogContributorConfig,
  therapist?: TherapistPublicView
): ResolvedBlogContributor {
  return {
    name: therapist?.name || config.fallbackName,
    role: config.fallbackRole,
    credentials:
      config.fallbackCredentials ||
      (therapist
        ? `${therapist.experience}+ years experience${
            therapist.licenseAuthority ? ` • ${therapist.licenseAuthority}` : ""
          }`
        : undefined),
    profileSlug: therapist?.slug || config.profileSlug,
    image: therapist?.image,
    languages: therapist?.languages,
  };
}

export const blogPosts: BlogPostDefinition[] = [
  {
    id: "managing-workplace-stress",
    title: "Managing Workplace Stress in the Modern Era",
    excerpt:
      "Learn effective strategies to handle workplace stress and maintain a healthy work-life balance in today's fast-paced professional environment.",
    image: "/images/blog/mindgood-workplace-stress-relief.jpg",
    publishedAt: "2025-07-10",
    lastReviewedAt: "2026-07-18",
    category: "Stress Management",
    readTime: "8 min read",
    languages: ["en", "hi", "ml", "ta", "te", "kn"],
    author: {
      profileSlug: "m-durga",
      fallbackName: "M. Durga",
      fallbackRole: "Written by MindGood psychologist",
      fallbackCredentials: "Consultant Psychologist • 9+ years experience",
    },
    reviewer: {
      profileSlug: "shruti-sharma",
      fallbackName: "Shruti Sharma",
      fallbackRole: "Clinically reviewed by MindGood psychologist",
      fallbackCredentials: "Psychologist • Anxiety, OCD, stress support",
    },
    whyCreated:
      "Created to help working adults in the UAE and GCC recognize burnout early, understand when stress may need professional support, and find a culturally aware therapist.",
    references: [
      {
        title: "Burn-out an occupational phenomenon",
        source: "World Health Organization",
        href: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon",
      },
      {
        title: "Coping with stress at work",
        source: "National Institute of Mental Health",
        href: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
      },
    ],
    content: `
      <p class="lead">Workplace stress can build quietly. It often starts as constant mental load, poor sleep, irritability, or feeling emotionally "on" even after work hours end.</p>

      <h2>What stress at work can look like</h2>
      <p>People do not always describe burnout as sadness. More often, they talk about exhaustion, reduced patience, brain fog, self-doubt, or feeling disconnected from work they once handled well.</p>

      <h2>Practical first steps</h2>
      <ul>
        <li><strong>Reduce nonstop activation:</strong> create a fixed end-of-work ritual and turn off non-urgent notifications.</li>
        <li><strong>Notice your body:</strong> headaches, jaw tension, stomach discomfort, and sleep changes are worth paying attention to.</li>
        <li><strong>Track patterns:</strong> note what situations spike stress so support can be more targeted.</li>
      </ul>

      <h2>When to seek professional support</h2>
      <p>If stress is affecting appetite, sleep, relationships, motivation, or confidence for more than a few weeks, speaking with a psychologist can help you build safer coping strategies and reduce the chance of deeper burnout.</p>
    `,
  },
  {
    id: "understanding-anxiety",
    title: "Anxiety: Navigating the Waves of Modern Worry",
    excerpt:
      "Anxiety is more than just stress. Discover the neurobiology of worry and learn how to respond to uncertainty with steadier coping tools.",
    image: "/images/blog/mindfulness-support-mindgood.jpg",
    publishedAt: "2025-07-05",
    lastReviewedAt: "2026-07-18",
    category: "Anxiety",
    readTime: "10 min read",
    languages: ["en", "ml", "ta", "hi", "te", "kn"],
    author: {
      profileSlug: "shruti-sharma",
      fallbackName: "Shruti Sharma",
      fallbackRole: "Written by MindGood psychologist",
      fallbackCredentials: "Psychologist • OCD, anxiety, PTSD support",
    },
    reviewer: {
      profileSlug: "m-durga",
      fallbackName: "M. Durga",
      fallbackRole: "Clinically reviewed by MindGood psychologist",
      fallbackCredentials: "Consultant Psychologist • 9+ years experience",
    },
    whyCreated:
      "Created to help readers distinguish everyday worry from anxiety symptoms that may need structured therapeutic support.",
    references: [
      {
        title: "Anxiety Disorders",
        source: "National Institute of Mental Health",
        href: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
      },
      {
        title: "Anxiety disorders",
        source: "American Psychiatric Association",
        href: "https://www.psychiatry.org/patients-families/anxiety-disorders/what-are-anxiety-disorders",
      },
    ],
    content: `
      <p class="lead">Anxiety is a real mind-body response, not a lack of willpower. It can show up as overthinking, restlessness, muscle tension, sleep difficulty, or a constant sense that something bad is about to happen.</p>

      <h2>Why anxiety feels physical</h2>
      <p>When your brain reads a threat, your body prepares to protect you. That can mean a faster heart rate, shallow breathing, sweating, nausea, or a sense of urgency even when no actual danger is present.</p>

      <h2>Support tools that often help</h2>
      <ul>
        <li><strong>Breathing and grounding:</strong> slow exhalation can help reduce nervous system activation.</li>
        <li><strong>Thought tracking:</strong> writing anxious predictions down makes them easier to challenge.</li>
        <li><strong>Therapy:</strong> CBT and ACT can help you respond to worry with more flexibility.</li>
      </ul>

      <h2>When support matters most</h2>
      <p>If anxiety is making daily life smaller, affecting work, isolating you socially, or causing panic, professional help can give you a more sustainable path forward.</p>
    `,
  },
  {
    id: "parenting-challenges",
    title: "Parenting in the Digital Age: A Guide for Modern Families",
    excerpt:
      "Explore strategies for parenting in a technology-shaped world while protecting connection, boundaries, and emotional safety at home.",
    image: "/images/blog/parenting-challenge-digital-era.jpg",
    publishedAt: "2025-06-28",
    lastReviewedAt: "2026-07-18",
    category: "Parenting",
    readTime: "9 min read",
    languages: ["en", "ml", "kn", "hi", "ta", "te"],
    author: {
      profileSlug: "rajiv-prasath",
      fallbackName: "Rajiv Prasath",
      fallbackRole: "Written by MindGood psychologist",
      fallbackCredentials: "Mental health professional • Relationship and family support",
    },
    reviewer: {
      profileSlug: "m-durga",
      fallbackName: "M. Durga",
      fallbackRole: "Clinically reviewed by MindGood psychologist",
      fallbackCredentials: "Consultant Psychologist • Family and parenting support",
    },
    whyCreated:
      "Created to support parents who are balancing emotional connection, digital boundaries, and changing family expectations.",
    references: [
      {
        title: "Positive parenting tips",
        source: "CDC",
        href: "https://www.cdc.gov/parenting/",
      },
      {
        title: "Parenting for a healthy mind",
        source: "UNICEF",
        href: "https://www.unicef.org/parenting",
      },
    ],
    content: `
      <h2>Digital life changes family stress</h2>
      <p>Parents today are often managing school pressure, screen time conflict, comparison culture, and their own burnout at the same time. That can make discipline and connection feel harder than they used to.</p>

      <h2>What helps at home</h2>
      <ul>
        <li><strong>Use predictable routines:</strong> children usually respond better to consistency than repeated correction.</li>
        <li><strong>Separate behavior from identity:</strong> address the action without shaming the child.</li>
        <li><strong>Model regulation:</strong> your response becomes part of your child’s emotional learning.</li>
      </ul>

      <h2>When to involve a psychologist</h2>
      <p>If conflict is constant, a child seems withdrawn, or parenting stress is affecting the whole family system, family-focused counselling can help rebuild communication and reduce blame.</p>
    `,
  },
  {
    id: "supporting-learning-disabilities",
    title: "Empowering Children with Learning Disabilities",
    excerpt:
      "Practical advice for parents supporting children with ADHD, dyslexia, and other learning differences at home and in school.",
    image: "/images/blog/learning-disability-support-mindgood.jpg",
    publishedAt: "2025-06-20",
    lastReviewedAt: "2026-07-18",
    category: "Specialized",
    readTime: "12 min read",
    languages: ["en", "ta", "te", "hi", "ml", "kn"],
    author: {
      profileSlug: "m-durga",
      fallbackName: "M. Durga",
      fallbackRole: "Written by MindGood psychologist",
      fallbackCredentials: "Consultant Psychologist • Child and family counselling support",
    },
    reviewer: {
      profileSlug: "rajiv-prasath",
      fallbackName: "Rajiv Prasath",
      fallbackRole: "Clinically reviewed by MindGood psychologist",
      fallbackCredentials: "Mental health professional • Emotional and behavioral support",
    },
    whyCreated:
      "Created to help families understand that learning differences need support, structure, and advocacy rather than shame or comparison.",
    references: [
      {
        title: "Learning disabilities and disorders",
        source: "CDC",
        href: "https://www.cdc.gov/child-development/learning-disorder/index.html",
      },
      {
        title: "Attention-deficit/hyperactivity disorder",
        source: "National Institute of Mental Health",
        href: "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd",
      },
    ],
    content: `
      <h2>Support begins with understanding</h2>
      <p>A learning disability does not define a child’s intelligence or future. It means the child may need a different pace, different tools, and more coordinated support between home, school, and therapy.</p>

      <h2>What parents can do</h2>
      <ul>
        <li><strong>Focus on strengths:</strong> children do better when support includes what they enjoy and do well.</li>
        <li><strong>Reduce comparison:</strong> repeated comparison can damage confidence faster than the learning issue itself.</li>
        <li><strong>Ask for structured guidance:</strong> assessment and intervention plans help everyone respond consistently.</li>
      </ul>

      <h2>Why early help matters</h2>
      <p>Timely support can improve emotional wellbeing, classroom participation, family communication, and long-term self-esteem.</p>
    `,
  },
];

function resolveTherapistBySlug(
  therapists: TherapistPublicView[],
  slug?: string
) {
  if (!slug) {
    return undefined;
  }

  return therapists.find((therapist) => therapist.slug === slug);
}

function resolveBlogPost(
  post: BlogPostDefinition,
  therapists: TherapistPublicView[]
): ResolvedBlogPost {
  return {
    ...post,
    author: buildContributor(post.author, resolveTherapistBySlug(therapists, post.author.profileSlug)),
    reviewer: post.reviewer
      ? buildContributor(post.reviewer, resolveTherapistBySlug(therapists, post.reviewer.profileSlug))
      : undefined,
  };
}

export async function getBlogPosts(): Promise<ResolvedBlogPost[]> {
  const therapists = await getPublicTherapists();
  return blogPosts.map((post) => resolveBlogPost(post, therapists));
}

export async function getBlogPostBySlug(slug: string): Promise<ResolvedBlogPost | undefined> {
  const therapists = await getPublicTherapists();
  const post = blogPosts.find((entry) => entry.id === slug);

  return post ? resolveBlogPost(post, therapists) : undefined;
}

export async function getRelatedPosts(
  slug: string,
  category: string,
  limit = 3
): Promise<ResolvedBlogPost[]> {
  const therapists = await getPublicTherapists();

  return blogPosts
    .filter((post) => post.id !== slug && post.category === category)
    .slice(0, limit)
    .map((post) => resolveBlogPost(post, therapists));
}
