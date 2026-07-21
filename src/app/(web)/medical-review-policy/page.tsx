import { Metadata } from "next";
import { TrustPageLayout } from "@/components/trust/TrustPageLayout";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Medical Review Policy | MindGood",
  description:
    "Learn how MindGood approaches clinical review for public-facing mental health content and how review differs from platform verification and therapist licensing.",
  alternates: {
    canonical: `${siteUrl}/medical-review-policy`,
  },
};

export default function MedicalReviewPolicyPage() {
  return (
    <TrustPageLayout
      eyebrow="Medical Review Policy"
      title="How MindGood Approaches Clinical Review of Public Content"
      intro="Some MindGood pages touch on mental health concerns that can influence real care decisions. Our medical and clinical review approach is meant to improve trust, accuracy, and responsible framing for that content."
      sections={[
        {
          title: "What clinical review is for",
          paragraphs: [
            "Clinical review helps us evaluate whether public content reflects mental health topics in a responsible and understandable way.",
            "This is especially important for pages about anxiety, depression, trauma, relationship distress, grief, burnout, and similar topics where readers may be actively looking for help."
          ],
        },
        {
          title: "What reviewers focus on",
          paragraphs: [
            "A clinical review process should focus on whether content is responsible for the topic and the user context."
          ],
          bullets: [
            "Whether language is accurate and not misleading",
            "Whether claims are framed appropriately",
            "Whether crisis boundaries are clear",
            "Whether the page supports safe next steps",
            "Whether the content matches the real services available on MindGood"
          ],
        },
        {
          title: "How clinical review differs from therapist verification",
          paragraphs: [
            "Clinical review is about the quality and framing of public educational content.",
            "Therapist verification is about reviewing public-facing therapist details such as identity, experience, languages, and profile information. These are related trust systems, but they are not the same thing."
          ],
        },
        {
          title: "Important limitation",
          paragraphs: [
            "A clinically reviewed page is still not a diagnosis, a personalized treatment recommendation, or a substitute for emergency help.",
            "Users experiencing immediate risk, severe symptoms, or urgent mental health distress should seek emergency or crisis support in their area."
          ],
        },
      ]}
      ctaTitle="Need a clearer path to support?"
      ctaBody="Use our therapist pages and care topics as a guide, then choose a therapist or contact MindGood if you need help finding the right next step."
    />
  );
}
