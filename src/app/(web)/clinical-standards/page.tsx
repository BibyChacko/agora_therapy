import { Metadata } from "next";
import { TrustPageLayout } from "@/components/trust/TrustPageLayout";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Clinical Standards | MindGood",
  description:
    "Learn how MindGood approaches therapist quality, professional standards, multilingual care, and client safety across the UAE and GCC.",
  alternates: {
    canonical: `${siteUrl}/clinical-standards`,
  },
};

export default function ClinicalStandardsPage() {
  return (
    <TrustPageLayout
      eyebrow="Clinical Standards"
      title="How MindGood Approaches Quality and Clinical Responsibility"
      intro="MindGood is designed to make therapy more accessible without lowering the standards people should expect from a mental health platform. Our clinical standards focus on therapist qualifications, responsible communication, multilingual care, and safe user support."
      sections={[
        {
          title: "What our standards are designed to protect",
          paragraphs: [
            "Our standards are built to protect trust, dignity, and clinical reliability. We want people to feel confident that the therapists they discover on MindGood have been reviewed carefully and presented accurately.",
            "These standards also help us maintain consistency across therapist profiles, content, booking flows, and support communication."
          ],
        },
        {
          title: "What we look for in public therapist profiles",
          paragraphs: [
            "Public-facing therapist profiles should accurately represent the therapist’s professional identity, years of experience, language support, and areas of practice.",
            "We aim to present information in clear language so users can understand what kind of support a therapist offers before they book."
          ],
          bullets: [
            "Identity and professional details should be accurate and up to date.",
            "Language support should reflect the therapist’s real working languages.",
            "Specializations and modalities should match the therapist’s practice profile.",
            "Verification and licensing details should be presented clearly where available."
          ],
        },
        {
          title: "Multilingual and culturally aware care",
          paragraphs: [
            "MindGood serves multilingual and multicultural communities across the UAE and GCC. We believe language and context matter deeply in mental health care.",
            "Our goal is to help users find therapists who can work in the language that feels most natural and in a way that respects cultural context, family systems, and migration realities."
          ],
        },
        {
          title: "Safety and boundaries",
          paragraphs: [
            "MindGood is intended to support access to therapy and mental health information. It is not an emergency service, and it is not a substitute for immediate crisis intervention, urgent psychiatric care, or emergency medical treatment.",
            "When a user may need emergency help, our priority is to direct them to urgent local support rather than present routine therapy as the right response."
          ],
        },
      ]}
      ctaTitle="Need support that feels trustworthy?"
      ctaBody="Explore verified therapist profiles, understand how we review public information, and choose care that fits your language and needs."
    />
  );
}
