from pathlib import Path


OUT_DIR = Path("deliverables")
RTF_PATH = OUT_DIR / "Mindgood_Platform_Gap_Analysis.rtf"


def esc(text: str) -> str:
    return (
        text.replace("\\", "\\\\")
        .replace("{", "\\{")
        .replace("}", "\\}")
        .replace("\n", "\\line ")
    )


parts: list[str] = []


def add(raw: str) -> None:
    parts.append(raw)


def para(text: str = "", style: str = "", before: int = 0, after: int = 160) -> None:
    add(r"{\pard\sa%d\sb%d%s %s\par}" % (after, before, style, esc(text)))


def bullet(text: str) -> None:
    add(r"{\pard\li360\fi-180\sa80\f0\fs22 " + esc("- " + text) + r"\par}")


def numbered(num: int, text: str) -> None:
    add(r"{\pard\li360\fi-220\sa80\f0\fs22 " + esc(f"{num}. {text}") + r"\par}")


def heading1(text: str) -> None:
    para(text, style=r"\f0\b\fs32\cf3", before=260, after=120)


def heading2(text: str) -> None:
    para(text, style=r"\f0\b\fs26\cf2", before=220, after=100)


def heading3(text: str) -> None:
    para(text, style=r"\f0\b\fs24\cf3", before=140, after=60)


def body(text: str) -> None:
    para(text, style=r"\f0\fs22\cf1", after=120)


def label_value(label: str, value: str) -> None:
    add(
        r"{\pard\sa80\f0\fs22\cf1\b "
        + esc(label + "  ")
        + r"\b0 "
        + esc(value)
        + r"\par}"
    )


def section_gap() -> None:
    para("", after=60)


doc_header = r"""{\rtf1\ansi\deff0
{\fonttbl{\f0 Arial;}}
{\colortbl;
\red17\green17\blue17;
\red46\green116\blue181;
\red31\green77\blue120;
\red95\green107\blue122;
\red155\green28\blue28;
\red122\green90\blue0;
\red215\green223\blue231;}
\paperw12240\paperh15840\margl1440\margr1440\margt1440\margb1440
\viewkind4\uc1
"""

add(doc_header)
para("Business Analysis Brief", style=r"\f0\b\fs20\cf4", after=80)
para("Mindgood Platform Gap Analysis", style=r"\f0\b\fs46\cf1", after=40)
para(
    "Assessment of current product coverage, critical gaps, and requirements needed for a mature mental wellness platform",
    style=r"\f0\fs26\cf4",
    after=220,
)

label_value("Prepared for", "Mindgood product and delivery stakeholders")
label_value("Prepared on", "July 7, 2026")
label_value(
    "Assessment basis",
    "Current application codebase, platform routes, data models, API flows, legal content, and operational features in the Mindgood repository",
)
label_value(
    "Assessment lens",
    "Business analysis, clinical operations readiness, trust and safety, platform maturity, and user journey completeness",
)
section_gap()

heading2("Executive Summary")
body(
    "Mindgood already has the foundation of a strong therapy marketplace and service operations platform. "
    "The product supports therapist onboarding, therapist discovery, client booking, payments, video sessions, "
    "administrative oversight, and lightweight reflective journaling."
)
body(
    "From a business analysis perspective, the current solution is more mature as a therapist booking and "
    "session delivery platform than as a full mental wellness platform. The most important gaps are concentrated "
    "in clinical workflow depth, crisis and safeguarding operations, privacy and compliance readiness, "
    "continuity-of-care tooling, and secure between-session support."
)
para(
    "Overall BA conclusion: Mindgood is well-positioned as a digital therapy marketplace, but it still needs "
    "structured intake, assessments, care planning, safety workflows, secure messaging, stronger access control, "
    "and production-grade compliance controls before it can be considered a properly rounded mental wellness platform.",
    style=r"\f0\b\fs22\cf3",
    before=80,
    after=180,
)

heading2("Current Platform Coverage")
body("The current platform already shows meaningful strength in these areas:")
bullet("Therapist marketplace: strong therapist profiles, services, specializations, languages, and verification flow.")
bullet("Scheduling and booking: strong availability, slot selection, appointment creation, and schedule management.")
bullet("Video session delivery: working Agora-based session support, though governance can be tighter.")
bullet("Payments and payouts: present and fairly mature operationally, but with some consistency risks.")
bullet("Admin operations: strong operational intent across therapists, users, reviews, appointments, payments, and refunds.")
bullet("Wellness engagement: basic journaling exists, but is not yet deeply connected to care or outcomes.")
bullet("Clinical workflows: currently light compared with what a mature mental wellness platform requires.")
bullet("Compliance readiness: partially present, but not yet production-grade in several key areas.")

heading2("Critical Gaps")

critical_gaps = [
    (
        "1. Structured Clinical Intake Is Missing",
        "The platform captures basic user identity and therapist profile information, but it does not yet capture intake-grade client data such as presenting concerns, risk history, therapy goals, medication profile, previous therapy history, emergency contacts, consent records, or support preferences.",
    ),
    (
        "2. Crisis and Safeguarding Workflows Are Not Operationalized",
        "Mindgood references crisis support and non-emergency disclaimers, but there is no visible product flow for risk detection, safety escalation, emergency contact use, crisis referral, therapist alerting, or incident handling.",
    ),
    (
        "3. Secure Therapist-Client Messaging Is Not Yet Live",
        "Between-session communication is a core part of ongoing mental wellness support. The current product does not yet offer production-ready secure asynchronous messaging, which limits continuity, check-ins, homework support, and lower-friction engagement.",
    ),
    (
        "4. Care Documentation Is Too Light",
        "Therapists can add a client-visible note and a private summary, but there is no structured session note model, no treatment plan tracking, no goals library, no homework mechanism, and no clinically meaningful review of progress over time.",
    ),
    (
        "5. Compliance and Consent Controls Need Production Hardening",
        "Privacy and terms pages still contain sample-document disclaimers, and client settings still contain unfinished profile and notification update flows. This creates a maturity gap in trust, auditability, and regulatory defensibility.",
    ),
    (
        "6. Access Control and Role Enforcement Need Strengthening",
        "Role-based protection is not yet stringent enough for a platform handling sensitive behavioral-health information. This creates both technical and platform trust risk.",
    ),
    (
        "7. Guest Participation in Sessions Needs Better Governance",
        "Couples and family sessions may justify guest access, but the product should still track participant approval, relationship role, informed consent, and a verifiable attendance record for all attendees.",
    ),
    (
        "8. Wellness Tracking Is Present but Not Yet Meaningful",
        "Journaling is a positive start, but it is not yet connected to therapist review, goals, interventions, symptom scoring, or measurable outcome improvement.",
    ),
]

for title, text in critical_gaps:
    heading3(title)
    body(text)

heading2("Requirements Matrix")
body("Priority requirements needed for a proper mental wellness platform:")
bullet("Clinical intake - Must have: presenting concerns, goals, symptom history, medications, past treatment, emergency contacts, and consent capture.")
bullet("Safety and crisis - Must have: risk flags, crisis guidance, therapist incident workflow, emergency escalation paths, and audit logs.")
bullet("Secure communication - Must have: encrypted messaging, attachments, read states, boundaries, and response-time expectations.")
bullet("Care continuity - Must have: structured notes, treatment plans, shared goals, homework, journaling review, and follow-up actions.")
bullet("Measurement-based care - Must have: PHQ-9, GAD-7, sleep and stress scales, reassessment cadence, and score trend visibility.")
bullet("Compliance and consent - Must have: final legal documents, versioned consents, communication preferences, retention controls, and stronger server-side authorization.")
bullet("Therapist productivity - Should have: note templates, caseload views, reusable interventions, and follow-up reminders.")
bullet("Self-guided wellness - Should have: guided exercises, sleep routines, CBT worksheets, habit check-ins, and educational content.")
bullet("Outcome and retention analytics - Should have: activation, retention, no-show reasons, symptom improvement, and therapist response metrics.")

heading2("Recommended Product Roadmap")
heading3("Phase 1: Trust, Security, and Operational Integrity")
numbered(1, "Harden authentication and role-based authorization for all sensitive routes and data flows.")
numbered(2, "Fix payment, webhook, and appointment-status consistency so session and revenue state stay reliable.")
numbered(3, "Replace sample legal documents with reviewed production policies and capture explicit user consents.")
numbered(4, "Define governance for guest participation in couples and family sessions.")

heading3("Phase 2: Clinical Intake and Safety Foundations")
numbered(1, "Launch a structured intake journey for clients.")
numbered(2, "Add emergency contacts, therapy goals, and safeguarding questions.")
numbered(3, "Introduce crisis and incident pathways for therapists and admins.")
numbered(4, "Add clinical screening instruments and baseline scoring.")

heading3("Phase 3: Continuity of Care and Engagement")
numbered(1, "Release secure therapist-client messaging.")
numbered(2, "Expand session notes into structured clinical documentation.")
numbered(3, "Introduce care plans, homework, and journaling review loops.")
numbered(4, "Link wellness check-ins to measurable client progress.")

heading3("Phase 4: Outcomes, Scale, and Differentiation")
numbered(1, "Add client and therapist outcome dashboards.")
numbered(2, "Measure activation, retention, no-show, and symptom-improvement trends.")
numbered(3, "Introduce guided self-help content and between-session wellness modules.")
numbered(4, "Use reporting to shape future matching, therapist tooling, and service-line expansion.")

heading2("Suggested Data Model Additions")
bullet("ClientIntakeProfile - presenting concerns, history, support preferences, emergency contact, risk and safeguarding data, consent flags, and matching inputs.")
bullet("AssessmentResponse - screening scores such as PHQ-9, GAD-7, sleep, stress, and follow-up reassessments over time.")
bullet("CarePlan - therapist-defined treatment goals, shared actions, milestones, interventions, and review cadence.")
bullet("SessionNote - structured post-session documentation with clinical summary, client-visible guidance, homework, risk notes, and next-step planning.")
bullet("MessageThread and Message - secure between-session communication, boundaries, attachments, and visibility rules.")
bullet("SafetyIncident - crisis flags, therapist escalations, actions taken, and admin review history.")
bullet("ConsentRecord - policy acceptance, clinical consent, communication consent, and version history.")
bullet("ProgressMetric - symptom trends, adherence markers, check-in streaks, and improvement snapshots for dashboards.")

heading2("Business Implications")
heading3("Risks if gaps remain open")
bullet("Difficulty positioning Mindgood credibly as a complete mental wellness platform.")
bullet("Lower therapist efficiency and weaker continuity between sessions.")
bullet("Higher trust risk around privacy, safety, and guest participation.")
bullet("Weaker client retention because the product remains session-only rather than journey-based.")

heading3("Benefits if gaps are addressed")
bullet("Stronger clinical credibility and safer care operations.")
bullet("Higher retention through ongoing engagement beyond appointments.")
bullet("Better therapist productivity and richer client outcomes.")
bullet("Clearer differentiation from appointment-only therapy marketplaces.")

heading2("Final Recommendation")
body(
    "Mindgood should continue to build on its strengths in therapist discovery, booking, video sessions, and admin operations, "
    "while deliberately investing next in trust, safety, clinical workflow depth, and continuity-of-care tooling. "
    "Those areas will create the biggest jump in platform maturity and are the most important for positioning Mindgood "
    "as a proper mental wellness platform rather than only a digital appointment and session system."
)
body(
    "The recommended next artifact after this analysis is a prioritized BA backlog with epics, user stories, "
    "data entities, acceptance criteria, and release phasing for the high-priority gaps identified above."
)

add("}")

OUT_DIR.mkdir(parents=True, exist_ok=True)
RTF_PATH.write_text("".join(parts), encoding="utf-8")
print(RTF_PATH)
