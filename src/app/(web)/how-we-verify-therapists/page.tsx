import { Metadata } from "next";
import { TrustPageLayout } from "@/components/trust/TrustPageLayout";
import { siteUrl, supportEmail } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How We Verify Therapists | MindGood",
  description:
    "Understand how MindGood reviews therapist identity, licensing information, profile details, and public-facing credentials before showing a therapist as verified.",
  alternates: {
    canonical: `${siteUrl}/how-we-verify-therapists`,
  },
};

export default function HowWeVerifyTherapistsPage() {
  return (
    <TrustPageLayout
      eyebrow="Therapist Verification"
      title="How MindGood Verifies Therapists"
      intro="MindGood uses a therapist verification process to help users understand which public profiles have had their professional details reviewed by our team. Verification is part of how we build trust on the platform."
      sections={[
        {
          title: "What verification means on MindGood",
          paragraphs: [
            "A verified therapist profile on MindGood means the platform has reviewed key profile details before presenting that therapist publicly as verified.",
            "Verification is intended to strengthen confidence in the information shown on the profile. It does not replace a user’s own judgment about therapeutic fit, and it does not guarantee that every therapist is right for every person."
          ],
        },
        {
          title: "Details we review",
          paragraphs: [
            "Our review process focuses on the key information a user relies on when choosing a therapist.",
          ],
          bullets: [
            "Professional identity information",
            "Licensing details and issuing authority where provided",
            "Years of experience and scope of practice",
            "Languages offered for sessions",
            "Public profile description and areas of specialization"
          ],
        },
        {
          title: "What verification does not mean",
          paragraphs: [
            "Verification does not mean MindGood is certifying clinical outcomes, guaranteeing compatibility, or replacing any formal licensing body.",
            "A verified badge should be understood as a platform-level trust signal that the profile information has been reviewed for public presentation."
          ],
        },
        {
          title: "Updating and reporting profile information",
          paragraphs: [
            "If a therapist updates their public profile, or if we receive new information that changes the status of the information displayed, we may revise the profile accordingly.",
            `If you believe a therapist profile contains incorrect information, please contact us at ${supportEmail}.`
          ],
        },
      ]}
      ctaTitle="Looking for a verified therapist?"
      ctaBody="Browse public therapist profiles that include professional background, languages, experience, and MindGood verification details."
    />
  );
}
