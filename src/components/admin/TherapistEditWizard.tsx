/**
 * Admin Therapist Edit Wizard
 * Allows admins to edit all therapist onboarding fields.
 */

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  DollarSign,
} from "lucide-react";
import { TIMEZONE_GROUPS } from "@/lib/constants/timezones";
import { LanguageMultiSelect } from "@/components/onboarding/LanguageMultiSelect";
import { ServicesSelectionStep } from "@/components/onboarding/ServicesSelectionStep";
import { AvailabilitySetupStep } from "@/components/onboarding/AvailabilitySetupStep";

type WeeklyHours = Record<number, { start: string; end: string }[]>;

export type AdminTherapistDetail = {
  id: string;
  email: string;
  status: string;
  metadata?: {
    createdAt: string;
    lastLoginAt: string;
  };
  profile: {
    displayName: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    avatarUrl?: string;
    timezone: string;
    locale: string;
    languages: string[];
    gender?: "male" | "female" | "prefer-not-to-say" | null;
  };
  therapistProfile?: {
    photoURL?: string;
    services?: string[];
    credentials: {
      licenseNumber: string;
      licenseState: string;
      licenseExpiry?: string;
      specializations: string[];
      certifications: string[];
    };
    practice: {
      bio: string;
      yearsExperience: number;
      sessionTypes: ("individual" | "couples" | "family" | "group")[];
      hourlyRate: number;
      languages: string[];
      currency: string;
    };
    availability: {
      timezone: string;
      bufferMinutes: number;
      maxDailyHours: number;
      advanceBookingDays: number;
      weeklyHours?: WeeklyHours;
    };
    verification?: {
      isVerified: boolean;
      verifiedAt?: string;
      verifiedBy?: string;
    };
    isFeatured?: boolean;
  };
};

type StepId =
  | "basic-info"
  | "photo"
  | "services"
  | "credentials"
  | "practice"
  | "rates"
  | "availability";

const steps: { id: StepId; title: string; required?: boolean }[] = [
  { id: "basic-info", title: "Basic Info", required: true },
  { id: "photo", title: "Photo" },
  { id: "services", title: "Services", required: true },
  { id: "credentials", title: "Credentials", required: true },
  { id: "practice", title: "Practice", required: true },
  { id: "rates", title: "Rates", required: true },
  { id: "availability", title: "Availability", required: true },
];

const locales = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "de-DE", label: "German" },
  { value: "it-IT", label: "Italian" },
  { value: "pt-BR", label: "Portuguese" },
  { value: "ja-JP", label: "Japanese" },
  { value: "ko-KR", label: "Korean" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "ar-AE", label: "Arabic" },
];

const sessionTypes: {
  id: "individual" | "couples" | "family" | "group";
  label: string;
}[] = [
  { id: "individual", label: "Individual" },
  { id: "couples", label: "Couples" },
  { id: "family", label: "Family" },
  { id: "group", label: "Group" },
];

function isoToDateInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function dateInputToIso(value: string) {
  if (!value) return undefined;
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

async function uploadToCloudinary(opts: { file: File; folder: string }) {
  const formData = new FormData();
  formData.append("file", opts.file);
  formData.append("folder", opts.folder);

  const response = await fetch("/api/upload", { method: "POST", body: formData });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const data = await response.json();
  return { url: data.url as string };
}

export function TherapistEditWizard({
  therapist,
  onCancel,
  onSaved,
}: {
  therapist: AdminTherapistDetail;
  onCancel: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);

  const initialWeeklyHours = therapist.therapistProfile?.availability?.weeklyHours || {};

  const [form, setForm] = useState(() => {
    const therapistProfile = therapist.therapistProfile;
    return {
      profile: {
        firstName: therapist.profile.firstName || "",
        lastName: therapist.profile.lastName || "",
        displayName: therapist.profile.displayName || "",
        phoneNumber: therapist.profile.phoneNumber || "",
        timezone: therapist.profile.timezone || "UTC",
        locale: therapist.profile.locale || "en-US",
        languages: therapist.profile.languages || [],
        gender: therapist.profile.gender || null,
        avatarUrl: therapist.profile.avatarUrl || "",
      },
      therapistProfile: {
        photoURL: therapistProfile?.photoURL || "",
        services: therapistProfile?.services || [],
        credentials: {
          licenseNumber: therapistProfile?.credentials?.licenseNumber || "",
          licenseState: therapistProfile?.credentials?.licenseState || "",
          licenseExpiry: therapistProfile?.credentials?.licenseExpiry,
          specializations: therapistProfile?.credentials?.specializations || [],
          certifications: therapistProfile?.credentials?.certifications || [],
        },
        practice: {
          bio: therapistProfile?.practice?.bio || "",
          yearsExperience: therapistProfile?.practice?.yearsExperience || 0,
          sessionTypes: therapistProfile?.practice?.sessionTypes || [],
          hourlyRate: therapistProfile?.practice?.hourlyRate || 0,
          currency: therapistProfile?.practice?.currency || "USD",
        },
        availability: {
          timezone: therapistProfile?.availability?.timezone || therapist.profile.timezone || "UTC",
          bufferMinutes: therapistProfile?.availability?.bufferMinutes ?? 15,
          maxDailyHours: therapistProfile?.availability?.maxDailyHours ?? 8,
          advanceBookingDays: therapistProfile?.availability?.advanceBookingDays ?? 30,
          weeklyHours: initialWeeklyHours,
        },
      },
    };
  });

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const canContinue = useMemo(() => {
    const step = steps[currentStep];
    if (!step?.required) return true;

    if (step.id === "basic-info") {
      return Boolean(form.profile.firstName && form.profile.displayName);
    }
    if (step.id === "services") {
      return (form.therapistProfile.services || []).length > 0;
    }
    if (step.id === "credentials") {
      return Boolean(
        form.therapistProfile.credentials.licenseNumber &&
          form.therapistProfile.credentials.licenseState
      );
    }
    if (step.id === "practice") {
      return Boolean(form.therapistProfile.practice.bio && form.therapistProfile.practice.yearsExperience > 0);
    }
    if (step.id === "rates") {
      return form.therapistProfile.practice.hourlyRate > 0;
    }
    if (step.id === "availability") {
      return Object.keys(form.therapistProfile.availability.weeklyHours || {}).length > 0;
    }
    return true;
  }, [currentStep, form]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        profile: {
          firstName: form.profile.firstName,
          lastName: form.profile.lastName,
          displayName: form.profile.displayName,
          phoneNumber: form.profile.phoneNumber || null,
          avatarUrl: form.profile.avatarUrl || null,
          timezone: form.profile.timezone,
          locale: form.profile.locale,
          languages: form.profile.languages,
          gender: form.profile.gender,
        },
        therapistProfile: {
          photoURL: form.therapistProfile.photoURL || null,
          services: form.therapistProfile.services,
          credentials: {
            ...form.therapistProfile.credentials,
            licenseExpiry: form.therapistProfile.credentials.licenseExpiry || null,
          },
          practice: {
            ...form.therapistProfile.practice,
            languages: form.profile.languages,
          },
          availability: {
            ...form.therapistProfile.availability,
            weeklyHours: form.therapistProfile.availability.weeklyHours || {},
          },
        },
      };

      console.log("[admin][TherapistEditWizard] saving therapistId =", therapist.id);
      console.log("[admin][TherapistEditWizard] body =", body);

      const response = await fetch(`/api/admin/therapists/${therapist.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("[admin][TherapistEditWizard] save failed:", response.status, data);
        throw new Error(data.error || "Failed to save changes");
      }

      console.log("[admin][TherapistEditWizard] save ok");
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    const stepId = steps[currentStep].id;
    switch (stepId) {
      case "basic-info":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={form.profile.firstName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, firstName: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.profile.lastName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, lastName: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={form.profile.displayName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, displayName: e.target.value },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={form.profile.phoneNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, phoneNumber: e.target.value },
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={form.profile.gender || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile: {
                        ...prev.profile,
                        gender: (e.target.value as any) || null,
                      },
                    }))
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locale">Locale</Label>
                <select
                  id="locale"
                  value={form.profile.locale}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, locale: e.target.value },
                    }))
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  {locales.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={form.profile.timezone}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, timezone: e.target.value },
                    therapistProfile: {
                      ...prev.therapistProfile,
                      availability: {
                        ...prev.therapistProfile.availability,
                        timezone: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                {Object.entries(TIMEZONE_GROUPS).map(([group, zones]) => (
                  <optgroup key={group} label={group}>
                    {zones.map((z) => (
                      <option key={z.value} value={z.value}>
                        {z.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <LanguageMultiSelect
              selectedLanguages={form.profile.languages}
              onLanguagesChange={(languages) =>
                setForm((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, languages },
                }))
              }
              label="Therapy Languages"
              placeholder="Search languages..."
            />
          </div>
        );

      case "photo":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Profile Photo</h3>
              <p className="text-gray-600 text-sm">
                Upload a new photo (stored in therapist profile)
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center">
                {form.therapistProfile.photoURL ? (
                  <Image
                    src={form.therapistProfile.photoURL}
                    alt="Therapist photo"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-500">No photo</span>
                )}
              </div>

              <div className="flex gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingPhoto(true);
                      try {
                        const { url } = await uploadToCloudinary({
                          file,
                          folder: `agora_therapy/profiles/${therapist.id}`,
                        });
                        setForm((prev) => ({
                          ...prev,
                          profile: { ...prev.profile, avatarUrl: url },
                          therapistProfile: { ...prev.therapistProfile, photoURL: url },
                        }));
                      } finally {
                        setUploadingPhoto(false);
                        e.target.value = "";
                      }
                    }}
                  />
                  <Button type="button" disabled={uploadingPhoto}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingPhoto ? "Uploading..." : "Upload"}
                  </Button>
                </label>

                {form.therapistProfile.photoURL && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, avatarUrl: "" },
                        therapistProfile: { ...prev.therapistProfile, photoURL: "" },
                      }))
                    }
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case "services":
        return (
          <ServicesSelectionStep
            selectedServices={form.therapistProfile.services}
            onServicesChange={(services) =>
              setForm((prev) => ({
                ...prev,
                therapistProfile: { ...prev.therapistProfile, services },
              }))
            }
          />
        );

      case "credentials": {
        const certs = form.therapistProfile.credentials.certifications;
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={form.therapistProfile.credentials.licenseNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      therapistProfile: {
                        ...prev.therapistProfile,
                        credentials: {
                          ...prev.therapistProfile.credentials,
                          licenseNumber: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseState">License State *</Label>
                <Input
                  id="licenseState"
                  value={form.therapistProfile.credentials.licenseState}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      therapistProfile: {
                        ...prev.therapistProfile,
                        credentials: {
                          ...prev.therapistProfile.credentials,
                          licenseState: e.target.value,
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseExpiry">License Expiry</Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={isoToDateInput(form.therapistProfile.credentials.licenseExpiry)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    therapistProfile: {
                      ...prev.therapistProfile,
                      credentials: {
                        ...prev.therapistProfile.credentials,
                        licenseExpiry: dateInputToIso(e.target.value),
                      },
                    },
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Specializations</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add specialization"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    const value = (e.currentTarget.value || "").trim();
                    if (!value) return;
                    setForm((prev) => ({
                      ...prev,
                      therapistProfile: {
                        ...prev.therapistProfile,
                        credentials: {
                          ...prev.therapistProfile.credentials,
                          specializations: Array.from(
                            new Set([
                              ...prev.therapistProfile.credentials.specializations,
                              value,
                            ])
                          ),
                        },
                      },
                    }));
                    e.currentTarget.value = "";
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {form.therapistProfile.credentials.specializations.map((spec) => (
                  <Badge key={spec} variant="secondary" className="flex items-center gap-1">
                    {spec}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          therapistProfile: {
                            ...prev.therapistProfile,
                            credentials: {
                              ...prev.therapistProfile.credentials,
                              specializations:
                                prev.therapistProfile.credentials.specializations.filter(
                                  (s) => s !== spec
                                ),
                            },
                          },
                        }))
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Certificates (PDF)</Label>
                <span className="text-xs text-gray-500">{certs.length}/6</span>
              </div>

              <label className="inline-flex items-center">
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    if (files.length === 0) return;
                    if (certs.length + files.length > 6) {
                      alert("You can upload a maximum of 6 certificates");
                      e.target.value = "";
                      return;
                    }
                    setUploadingCertificate(true);
                    try {
                      const uploads = await Promise.all(
                        files.map(async (file) => {
                          const { url } = await uploadToCloudinary({
                            file,
                            folder: `agora_therapy/certificates/${therapist.id}`,
                          });
                          return url;
                        })
                      );
                      setForm((prev) => ({
                        ...prev,
                        therapistProfile: {
                          ...prev.therapistProfile,
                          credentials: {
                            ...prev.therapistProfile.credentials,
                            certifications: [...prev.therapistProfile.credentials.certifications, ...uploads],
                          },
                        },
                      }));
                    } finally {
                      setUploadingCertificate(false);
                      e.target.value = "";
                    }
                  }}
                />
                <Button type="button" disabled={uploadingCertificate} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingCertificate ? "Uploading..." : "Upload PDFs"}
                </Button>
              </label>

              {certs.length > 0 && (
                <div className="space-y-2">
                  {certs.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="flex items-center justify-between border rounded-md px-3 py-2 text-sm"
                    >
                      <span className="truncate">{url}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            therapistProfile: {
                              ...prev.therapistProfile,
                              credentials: {
                                ...prev.therapistProfile.credentials,
                                certifications: prev.therapistProfile.credentials.certifications.filter(
                                  (_, i) => i !== index
                                ),
                              },
                            },
                          }))
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case "practice":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                rows={7}
                value={form.therapistProfile.practice.bio}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    therapistProfile: {
                      ...prev.therapistProfile,
                      practice: { ...prev.therapistProfile.practice, bio: e.target.value },
                    },
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years Experience *</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  value={form.therapistProfile.practice.yearsExperience}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      therapistProfile: {
                        ...prev.therapistProfile,
                        practice: {
                          ...prev.therapistProfile.practice,
                          yearsExperience: e.target.value === "" ? 0 : Number(e.target.value),
                        },
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Session Types *</Label>
                <div className="flex flex-wrap gap-2">
                  {sessionTypes.map((t) => {
                    const selected = form.therapistProfile.practice.sessionTypes.includes(t.id);
                    return (
                      <Badge
                        key={t.id}
                        variant={selected ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            therapistProfile: {
                              ...prev.therapistProfile,
                              practice: {
                                ...prev.therapistProfile.practice,
                                sessionTypes: selected
                                  ? prev.therapistProfile.practice.sessionTypes.filter((s) => s !== t.id)
                                  : [...prev.therapistProfile.practice.sessionTypes, t.id],
                              },
                            },
                          }))
                        }
                      >
                        {t.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Languages for practice are saved from “Therapy Languages” in Basic Info.
            </div>
          </div>
        );

      case "rates":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.therapistProfile.practice.hourlyRate === 0
                      ? ""
                      : form.therapistProfile.practice.hourlyRate / 100
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      therapistProfile: {
                        ...prev.therapistProfile,
                        practice: {
                          ...prev.therapistProfile.practice,
                          hourlyRate: val === "" ? 0 : Math.round(Number(val) * 100),
                        },
                      },
                    }));
                  }}
                  placeholder="100.00"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500">Platform fee (3%) deducted from this amount</p>
            </div>
          </div>
        );

      case "availability":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bufferMinutes">Buffer Between Sessions (minutes)</Label>
                <Input
                  id="bufferMinutes"
                  type="number"
                  min="0"
                  value={form.therapistProfile.availability.bufferMinutes}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      therapistProfile: {
                        ...prev.therapistProfile,
                        availability: {
                          ...prev.therapistProfile.availability,
                          bufferMinutes: e.target.value === "" ? 0 : Number(e.target.value),
                        },
                      },
                    }))
                  }
                />
              </div>
            </div>

            <AvailabilitySetupStep
              weeklyHours={form.therapistProfile.availability.weeklyHours || {}}
              onWeeklyHoursChange={(weeklyHours) =>
                setForm((prev) => ({
                  ...prev,
                  therapistProfile: {
                    ...prev.therapistProfile,
                    availability: { ...prev.therapistProfile.availability, weeklyHours },
                  },
                }))
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Therapist Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        {renderStep()}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={saving}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
              disabled={!canContinue || saving}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSave} disabled={!canContinue || saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
