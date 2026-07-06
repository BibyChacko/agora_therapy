import type { SessionType } from "@/types/models/appointment";

export type SupportedTherapySessionType = "single" | "couple" | "family";

export type TherapySessionConfig = {
  value: SupportedTherapySessionType;
  label: string;
  description: string;
  duration: number;
  clientParticipants: number;
  totalParticipants: number;
};

export const THERAPY_SESSION_CONFIGS: TherapySessionConfig[] = [
  {
    value: "single",
    label: "Single Therapy",
    description: "1 participant and 1 counsellor",
    duration: 50,
    clientParticipants: 1,
    totalParticipants: 2,
  },
  {
    value: "couple",
    label: "Couple Therapy",
    description: "2 participants and 1 counsellor",
    duration: 60,
    clientParticipants: 2,
    totalParticipants: 3,
  },
  {
    value: "family",
    label: "Family Therapy",
    description: "Up to 4 participants and 1 counsellor",
    duration: 75,
    clientParticipants: 4,
    totalParticipants: 5,
  },
];

const LEGACY_SESSION_TYPE_MAP: Partial<Record<string, SupportedTherapySessionType>> = {
  individual: "single",
  consultation: "single",
  follow_up: "single",
  couples: "couple",
  group: "family",
};

export function normalizeTherapySessionType(
  value?: SessionType | string | null
): SupportedTherapySessionType {
  if (!value) {
    return "single";
  }

  if (value === "single" || value === "couple" || value === "family") {
    return value;
  }

  return LEGACY_SESSION_TYPE_MAP[value] || "single";
}

export function getTherapySessionConfig(
  value?: SessionType | string | null
): TherapySessionConfig {
  const normalized = normalizeTherapySessionType(value);

  return (
    THERAPY_SESSION_CONFIGS.find((config) => config.value === normalized) ||
    THERAPY_SESSION_CONFIGS[0]
  );
}

export function generateMeetingPasscode() {
  return Math.random().toString().slice(2, 8);
}
