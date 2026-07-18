/**
 * Backfill slug values on therapistProfiles documents.
 *
 * Usage:
 * npx ts-node scripts/backfill-therapist-slugs.ts
 */
const fs = require("fs");
const path = require("path");

const envPaths = [".env.local", ".env"]
  .map((file) => path.resolve(process.cwd(), file))
  .filter((file) => fs.existsSync(file));

for (const envPath of envPaths) {
  require("dotenv").config({ path: envPath, override: false });
}

const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");

if (admin.apps.length === 0) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    const serviceAccountPath = path.join(
      __dirname,
      "..",
      "google_services.json"
    );
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      console.error(
        "Missing Firebase Admin credentials. Please set environment variables or provide google_services.json"
      );
      process.exit(1);
    }
  }
}

const db = admin.firestore();

function slugify(value: string | undefined, fallback: string): string {
  const base = (value || fallback || "therapist")
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return base || fallback || "therapist";
}

function extractCity(location: string | undefined): string {
  if (!location) return "";
  const parts = location
    .split(",")
    .map((part: string) => part.trim())
    .filter(Boolean);
  return parts[0] || "";
}

async function slugExists(slug: string, currentId: string): Promise<boolean> {
  const snapshot = await db
    .collection("therapistProfiles")
    .where("slug", "==", slug)
    .limit(5)
    .get();

  return snapshot.docs.some((doc: { id: string }) => doc.id !== currentId);
}

async function buildUniqueSlug(
  baseSlug: string,
  therapistId: string
): Promise<string> {
  let candidate = baseSlug;
  let suffix = 2;

  while (await slugExists(candidate, therapistId)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function backfillTherapistSlugs() {
  const therapistProfilesSnapshot = await db.collection("therapistProfiles").get();

  if (therapistProfilesSnapshot.empty) {
    console.log("No therapist profiles found.");
    return;
  }

  let updatedCount = 0;

  for (const therapistDoc of therapistProfilesSnapshot.docs) {
    const therapistId = therapistDoc.id;
    const profileData = therapistDoc.data();
    const userDoc = await db.collection("users").doc(therapistId).get();

    if (!userDoc.exists) {
      console.warn(`Skipping ${therapistId}: missing users/${therapistId}`);
      continue;
    }

    const userData = userDoc.data() || {};
    const displayName =
      userData.profile?.displayName ||
      [userData.profile?.firstName, userData.profile?.lastName]
        .filter(Boolean)
        .join(" ");
    const city = extractCity(profileData.practice?.location);
    const baseSlug = slugify(
      [displayName, city].filter(Boolean).join(" "),
      therapistId.toLowerCase()
    );
    const uniqueSlug = await buildUniqueSlug(baseSlug, therapistId);

    if (profileData.slug === uniqueSlug) {
      console.log(`Unchanged ${therapistId}: ${uniqueSlug}`);
      continue;
    }

    await therapistDoc.ref.set(
      {
        slug: uniqueSlug,
        metadata: {
          updatedAt: Timestamp.now(),
        },
      },
      { merge: true }
    );

    updatedCount += 1;
    console.log(`Updated ${therapistId}: ${uniqueSlug}`);
  }

  console.log(`Done. Updated ${updatedCount} therapist profile slug(s).`);
}

backfillTherapistSlugs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to backfill therapist slugs:", error);
    process.exit(1);
  });
