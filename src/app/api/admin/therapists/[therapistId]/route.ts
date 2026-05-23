import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

/**
 * GET /api/admin/therapists/[therapistId]
 * Fetch a specific therapist's details
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ therapistId: string }> }
) {
  const { therapistId } = await context.params;
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = getAdminAuth();
    const db = getAdminFirestore();
    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { therapistId } = await context.params;

    // Fetch user data
    const therapistDoc = await db.collection("users").doc(therapistId).get();
    
    if (!therapistDoc.exists) {
      return NextResponse.json(
        { error: "Therapist not found" },
        { status: 404 }
      );
    }

    const therapistData = therapistDoc.data();

    // Fetch therapist profile from therapistProfiles collection
    const therapistProfileDoc = await db
      .collection("therapistProfiles")
      .doc(therapistId)
      .get();

    const therapistProfileData = therapistProfileDoc.exists
      ? therapistProfileDoc.data()
      : null;

    const therapist = {
      id: therapistDoc.id,
      email: therapistData?.email || "",
      profile: {
        displayName: therapistData?.profile?.displayName || "",
        firstName: therapistData?.profile?.firstName || "",
        lastName: therapistData?.profile?.lastName || "",
        phoneNumber: therapistData?.profile?.phoneNumber || "",
        avatarUrl: therapistData?.profile?.avatarUrl || "",
        timezone: therapistData?.profile?.timezone || "UTC",
        locale: therapistData?.profile?.locale || "en-US",
        languages: therapistData?.profile?.languages || [],
        gender: therapistData?.profile?.gender || null,
      },
      therapistProfile: therapistProfileData
        ? {
            photoURL: therapistProfileData.photoURL || "",
            isFeatured: therapistProfileData.isFeatured || false,
            services: therapistProfileData.services || [],
            credentials: {
              licenseNumber:
                therapistProfileData.credentials?.licenseNumber || "",
              licenseState:
                therapistProfileData.credentials?.licenseState || "",
              licenseExpiry: therapistProfileData.credentials?.licenseExpiry
                ?.toDate?.()
                ?.toISOString(),
              specializations:
                therapistProfileData.credentials?.specializations || [],
              certifications:
                therapistProfileData.credentials?.certifications || [],
            },
            practice: {
              bio: therapistProfileData.practice?.bio || "",
              yearsExperience:
                therapistProfileData.practice?.yearsExperience || 0,
              sessionTypes: therapistProfileData.practice?.sessionTypes || [],
              languages: therapistProfileData.practice?.languages || [],
              hourlyRate: therapistProfileData.practice?.hourlyRate || 0,
              currency: therapistProfileData.practice?.currency || "USD",
            },
            availability: {
              timezone: therapistProfileData.availability?.timezone || "UTC",
              bufferMinutes:
                therapistProfileData.availability?.bufferMinutes || 15,
              maxDailyHours:
                therapistProfileData.availability?.maxDailyHours || 8,
              advanceBookingDays:
                therapistProfileData.availability?.advanceBookingDays || 30,
              weeklyHours: therapistProfileData.availability?.weeklyHours || {},
            },
            verification: {
              isVerified:
                therapistProfileData.verification?.isVerified || false,
              verifiedAt: therapistProfileData.verification?.verifiedAt
                ?.toDate?.()
                ?.toISOString(),
              verifiedBy: therapistProfileData.verification?.verifiedBy,
            },
          }
        : undefined,
      status: therapistData?.status || "active",
      metadata: {
        createdAt:
          therapistData?.metadata?.createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
        lastLoginAt:
          therapistData?.metadata?.lastLoginAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      },
    };

    return NextResponse.json({ therapist });
  } catch (error) {
    console.error("Error fetching therapist:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapist" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/therapists/[therapistId]
 * Update therapist user + therapist profile (admin only)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ therapistId: string }> }
) {
  const { therapistId } = await context.params;
  try {
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = getAdminAuth();
    const db = getAdminFirestore();
    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload = (await request.json()) as {
      profile?: {
        firstName?: string;
        lastName?: string;
        displayName?: string;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        timezone?: string;
        locale?: string;
        languages?: string[];
        gender?: string | null;
      };
      therapistProfile?: {
        photoURL?: string | null;
        services?: string[];
        credentials?: {
          licenseNumber?: string;
          licenseState?: string;
          licenseExpiry?: string | null; // ISO string
          specializations?: string[];
          certifications?: string[];
        };
        practice?: {
          bio?: string;
          yearsExperience?: number;
          sessionTypes?: string[];
          languages?: string[];
          hourlyRate?: number;
          currency?: string;
        };
        availability?: {
          timezone?: string;
          bufferMinutes?: number;
          maxDailyHours?: number;
          advanceBookingDays?: number;
          weeklyHours?: Record<number, { start: string; end: string }[]>;
        };
      };
    };

    console.log("[admin][therapist][PATCH] therapistId =", therapistId);
    console.log("[admin][therapist][PATCH] payload =", JSON.stringify(payload));

    const updates: FirebaseFirestore.WriteBatch = db.batch();

    // Update user profile (users collection)
    if (payload.profile) {
      const userRef = db.collection("users").doc(therapistId);
      const profileUpdate: Record<string, unknown> = {};

      if (typeof payload.profile.firstName === "string") {
        profileUpdate["profile.firstName"] = payload.profile.firstName;
      }
      if (typeof payload.profile.lastName === "string") {
        profileUpdate["profile.lastName"] = payload.profile.lastName;
      }
      if (typeof payload.profile.displayName === "string") {
        profileUpdate["profile.displayName"] = payload.profile.displayName;
      }
      if (payload.profile.phoneNumber !== undefined) {
        const phone = payload.profile.phoneNumber;
        profileUpdate["profile.phoneNumber"] =
          phone && String(phone).trim().length > 0 ? phone : null;
      }
      if (payload.profile.avatarUrl !== undefined) {
        const avatarUrl = payload.profile.avatarUrl;
        profileUpdate["profile.avatarUrl"] =
          avatarUrl && String(avatarUrl).trim().length > 0 ? avatarUrl : null;
      }
      if (typeof payload.profile.timezone === "string") {
        profileUpdate["profile.timezone"] = payload.profile.timezone;
      }
      if (typeof payload.profile.locale === "string") {
        profileUpdate["profile.locale"] = payload.profile.locale;
      }
      if (Array.isArray(payload.profile.languages)) {
        profileUpdate["profile.languages"] = payload.profile.languages;
      }
      if (payload.profile.gender !== undefined) {
        profileUpdate["profile.gender"] = payload.profile.gender || null;
      }

      profileUpdate["metadata.updatedAt"] = FieldValue.serverTimestamp();
      updates.update(userRef, profileUpdate);
      console.log("[admin][therapist][PATCH] user profileUpdate =", JSON.stringify(profileUpdate));
    }

    // Update therapist profile (therapistProfiles collection)
    if (payload.therapistProfile) {
      const therapistRef = db.collection("therapistProfiles").doc(therapistId);
      const therapistUpdate: Record<string, unknown> = {};

      if (payload.therapistProfile.photoURL !== undefined) {
        therapistUpdate["photoURL"] = payload.therapistProfile.photoURL || null;
      }
      if (Array.isArray(payload.therapistProfile.services)) {
        therapistUpdate["services"] = payload.therapistProfile.services;
      }

      if (payload.therapistProfile.credentials) {
        const c = payload.therapistProfile.credentials;
        if (typeof c.licenseNumber === "string") {
          therapistUpdate["credentials.licenseNumber"] = c.licenseNumber;
        }
        if (typeof c.licenseState === "string") {
          therapistUpdate["credentials.licenseState"] = c.licenseState;
        }
        if (c.licenseExpiry !== undefined) {
          therapistUpdate["credentials.licenseExpiry"] = c.licenseExpiry
            ? Timestamp.fromDate(new Date(c.licenseExpiry))
            : null;
        }
        if (Array.isArray(c.specializations)) {
          therapistUpdate["credentials.specializations"] = c.specializations;
        }
        if (Array.isArray(c.certifications)) {
          therapistUpdate["credentials.certifications"] = c.certifications;
        }
      }

      if (payload.therapistProfile.practice) {
        const p = payload.therapistProfile.practice;
        if (typeof p.bio === "string") {
          therapistUpdate["practice.bio"] = p.bio;
        }
        if (typeof p.yearsExperience === "number") {
          therapistUpdate["practice.yearsExperience"] = p.yearsExperience;
        }
        if (Array.isArray(p.sessionTypes)) {
          therapistUpdate["practice.sessionTypes"] = p.sessionTypes;
        }
        if (Array.isArray(p.languages)) {
          therapistUpdate["practice.languages"] = p.languages;
        }
        if (typeof p.hourlyRate === "number") {
          therapistUpdate["practice.hourlyRate"] = p.hourlyRate;
        }
        if (typeof p.currency === "string") {
          therapistUpdate["practice.currency"] = p.currency;
        }
      }

      if (payload.therapistProfile.availability) {
        const a = payload.therapistProfile.availability;
        if (typeof a.timezone === "string") {
          therapistUpdate["availability.timezone"] = a.timezone;
        }
        if (typeof a.bufferMinutes === "number") {
          therapistUpdate["availability.bufferMinutes"] = a.bufferMinutes;
        }
        if (typeof a.maxDailyHours === "number") {
          therapistUpdate["availability.maxDailyHours"] = a.maxDailyHours;
        }
        if (typeof a.advanceBookingDays === "number") {
          therapistUpdate["availability.advanceBookingDays"] = a.advanceBookingDays;
        }
        if (a.weeklyHours !== undefined) {
          therapistUpdate["availability.weeklyHours"] = a.weeklyHours || {};
        }
      }

      therapistUpdate["metadata.updatedAt"] = FieldValue.serverTimestamp();
      console.log("[admin][therapist][PATCH] therapistUpdate =", JSON.stringify(therapistUpdate));

      // IMPORTANT:
      // Firestore `set(..., { merge: true })` does not reliably interpret dotted keys as nested paths.
      // Use `update()` when the doc exists so dotted keys update nested fields correctly.
      const existingTherapistProfile = await therapistRef.get();
      if (existingTherapistProfile.exists) {
        updates.update(therapistRef, therapistUpdate);
      } else {
        // Create minimal nested structure on first write
        const createdAt = FieldValue.serverTimestamp();
        const licenseExpiryValue = therapistUpdate["credentials.licenseExpiry"] ?? Timestamp.now();
        updates.set(
          therapistRef,
          {
            id: therapistId,
            photoURL: therapistUpdate["photoURL"] ?? null,
            services: therapistUpdate["services"] ?? [],
            credentials: {
              licenseNumber: therapistUpdate["credentials.licenseNumber"] ?? "",
              licenseState: therapistUpdate["credentials.licenseState"] ?? "",
              licenseExpiry: licenseExpiryValue,
              specializations: therapistUpdate["credentials.specializations"] ?? [],
              certifications: therapistUpdate["credentials.certifications"] ?? [],
            },
            practice: {
              bio: therapistUpdate["practice.bio"] ?? "",
              yearsExperience: therapistUpdate["practice.yearsExperience"] ?? 0,
              sessionTypes: therapistUpdate["practice.sessionTypes"] ?? [],
              languages: therapistUpdate["practice.languages"] ?? [],
              hourlyRate: therapistUpdate["practice.hourlyRate"] ?? 0,
              currency: therapistUpdate["practice.currency"] ?? "USD",
            },
            availability: {
              timezone: therapistUpdate["availability.timezone"] ?? "UTC",
              bufferMinutes: therapistUpdate["availability.bufferMinutes"] ?? 15,
              maxDailyHours: therapistUpdate["availability.maxDailyHours"] ?? 8,
              advanceBookingDays: therapistUpdate["availability.advanceBookingDays"] ?? 30,
              weeklyHours: therapistUpdate["availability.weeklyHours"] ?? {},
            },
            verification: {
              isVerified: false,
            },
            metadata: {
              createdAt,
              updatedAt: FieldValue.serverTimestamp(),
            },
          },
          { merge: true }
        );
      }
    }

    await updates.commit();
    console.log("[admin][therapist][PATCH] commit ok for therapistId =", therapistId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating therapist:", error);
    return NextResponse.json(
      { error: "Failed to update therapist" },
      { status: 500 }
    );
  }
}
