import { Metadata } from "next";
import { TrustPageLayout } from "@/components/trust/TrustPageLayout";
import { siteUrl, supportEmail, supportPhone } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Crisis & Emergency Help | MindGood",
  description:
    "Important information about when MindGood is not the right service, when to seek urgent help, and how to respond if you or someone else may be in immediate danger.",
  alternates: {
    canonical: `${siteUrl}/crisis-emergency-help`,
  },
};

export default function CrisisEmergencyHelpPage() {
  return (
    <TrustPageLayout
      eyebrow="Crisis & Emergency Help"
      title="When to Seek Urgent Help Instead of Routine Therapy"
      intro="MindGood is not an emergency service. If you or someone else may be in immediate danger, is at risk of self-harm, is at risk of harming others, or is experiencing a medical or psychiatric emergency, seek urgent local help right away."
      sections={[
        {
          title: "Get urgent help immediately if",
          paragraphs: [
            "Routine therapy booking is not the right path when there is immediate danger, acute risk, or a medical emergency."
          ],
          bullets: [
            "You may act on thoughts of suicide or self-harm",
            "Someone may be in immediate physical danger",
            "There is risk of harm to another person",
            "There is a severe psychiatric crisis, disorientation, or loss of contact with reality",
            "A person needs urgent medical assessment now"
          ],
        },
        {
          title: "What to do next",
          paragraphs: [
            "Call your local emergency services, go to the nearest emergency department, or contact a local crisis service in your area immediately.",
            "If you are supporting someone else, stay with them if it is safe to do so, reduce access to immediate means of harm where possible, and seek urgent local help without delay."
          ],
        },
        {
          title: "What MindGood can help with",
          paragraphs: [
            "MindGood can help people discover therapists, learn about common mental health concerns, and book routine support with licensed professionals when the situation is appropriate for scheduled care.",
            "If you are unsure whether your situation is urgent, it is safer to seek immediate local emergency guidance first."
          ],
        },
        {
          title: "Contacting MindGood",
          paragraphs: [
            `For routine support, platform questions, or help finding a therapist, contact MindGood at ${supportEmail} or ${supportPhone}.`,
            "Please do not rely on routine contact channels for emergency or crisis intervention."
          ],
        },
      ]}
      ctaTitle="Need routine support, not urgent intervention?"
      ctaBody="If your situation is not an immediate emergency, you can browse therapists, learn how MindGood verifies profiles, and find support in a language that feels natural."
    />
  );
}
