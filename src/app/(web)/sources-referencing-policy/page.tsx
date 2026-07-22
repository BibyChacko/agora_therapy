import { Metadata } from "next";
import { TrustPageLayout } from "@/components/trust/TrustPageLayout";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sources and Referencing Policy | MindGood",
  description:
    "Learn how MindGood chooses, uses, and updates sources for educational mental health content and public care guidance.",
  alternates: {
    canonical: `${siteUrl}/sources-referencing-policy`,
  },
};

export default function SourcesReferencingPolicyPage() {
  return (
    <TrustPageLayout
      eyebrow="Sources & Referencing Policy"
      title="How MindGood Uses Sources in Public Mental Health Content"
      intro="MindGood aims to publish educational content that is clear, responsible, and grounded in credible sources. This policy explains how we reference external material when public pages discuss mental health concerns, therapy approaches, or care-seeking guidance."
      sections={[
        {
          title: "What we try to source",
          paragraphs: [
            "We prioritize sourcing when content makes health-related, therapeutic, psychological, or safety-related claims.",
          ],
          bullets: [
            "Definitions of symptoms, conditions, and therapy approaches",
            "Guidance about when to seek professional support",
            "Statements about crisis, risk, or emergency boundaries",
            "Context that may influence treatment expectations or care decisions",
          ],
        },
        {
          title: "What kinds of sources we prefer",
          paragraphs: [
            "Not all sources carry the same weight. For mental health content, we prefer material that is broadly trusted, current where possible, and appropriate for public education.",
          ],
          bullets: [
            "Recognized public health institutions and government health agencies",
            "Professional psychiatric, psychological, or clinical bodies",
            "Peer-reviewed literature when it is directly useful for public understanding",
            "High-quality patient education resources from established institutions",
          ],
        },
        {
          title: "How sources are used on MindGood",
          paragraphs: [
            "Sources are meant to support responsible public education, not to create the impression that a page is individualized medical advice.",
            "We may summarize source material in plain language, but we avoid overstating certainty or presenting educational content as diagnosis or treatment instructions.",
          ],
        },
        {
          title: "Review and updates",
          paragraphs: [
            "Source lists should be revisited when a page is clinically reviewed, materially updated, or when a cited source becomes outdated, unavailable, or no longer suitable.",
          ],
        },
      ]}
      ctaTitle="Questions about trust or content quality?"
      ctaBody="Use our policy pages, therapist verification details, and clinical review notes to understand how MindGood approaches public mental health information."
    />
  );
}
