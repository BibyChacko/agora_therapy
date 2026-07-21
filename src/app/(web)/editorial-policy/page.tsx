import { Metadata } from "next";
import { TrustPageLayout } from "@/components/trust/TrustPageLayout";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Editorial Policy | MindGood",
  description:
    "Read how MindGood plans, writes, reviews, and updates public educational content for therapy, multilingual mental health, and support resources.",
  alternates: {
    canonical: `${siteUrl}/editorial-policy`,
  },
};

export default function EditorialPolicyPage() {
  return (
    <TrustPageLayout
      eyebrow="Editorial Policy"
      title="How MindGood Creates and Maintains Public Content"
      intro="MindGood publishes educational content to help users better understand therapy, mental health concerns, and the process of finding support. Our editorial policy is designed to keep that content clear, responsible, and useful."
      sections={[
        {
          title: "Why we publish content",
          paragraphs: [
            "Our content is created to help users make more informed decisions about therapy, understand common concerns, and find support in language that feels approachable.",
            "We aim to publish content that is practical, accurate, and respectful of the fact that mental health information can affect real decisions."
          ],
        },
        {
          title: "Editorial principles",
          paragraphs: [
            "We use a people-first approach. Content should be helpful, easy to understand, and written with care rather than inflated with unsupported claims."
          ],
          bullets: [
            "Clarity over hype",
            "Responsible mental health framing",
            "Respect for cultural and language context",
            "Plain-language explanations where possible",
            "Regular review and improvement of important pages"
          ],
        },
        {
          title: "Content ownership and updates",
          paragraphs: [
            "MindGood may revise, expand, or retire content when information changes, when new therapist inventory becomes available, or when we identify clearer ways to support users.",
            "We also improve content when we find places where users may misinterpret informational pages as emergency or diagnostic guidance."
          ],
        },
        {
          title: "What our editorial content is not",
          paragraphs: [
            "MindGood content is not a substitute for personalized medical advice, diagnosis, emergency evaluation, or urgent psychiatric care.",
            "Our educational pages are intended to help users learn and navigate support options, not to replace direct care from an appropriate professional."
          ],
        },
      ]}
      ctaTitle="Want to explore therapy topics?"
      ctaBody="Read concern pages, discover specialists, and use educational content as a guide for choosing your next step in care."
    />
  );
}
