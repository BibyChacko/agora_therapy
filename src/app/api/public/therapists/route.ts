import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase/admin";

/**
 * Public API to fetch verified therapists for the psychologists directory
 * No authentication required - this is public data
 */
export async function GET(request: NextRequest) {
  try {
    const db = getAdminFirestore();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const language = searchParams.get('language');
    const minExperience = searchParams.get('minExperience');
    const featured = searchParams.get('featured') === 'true';

    // Fetch all verified therapist profiles
    let profilesQuery = db
      .collection("therapistProfiles")
      .where("verification.isVerified", "==", true);

    const profilesSnapshot = await profilesQuery.get();

    // Fetch user data for names and map the results
    const therapists = await Promise.all(
      profilesSnapshot.docs.map(async (doc) => {
        const profileData = doc.data();
        const therapistId = doc.id;
        
        // Fetch corresponding user data for the name
        const userDoc = await db.collection("users").doc(therapistId).get();
        if (!userDoc.exists) {
          return null;
        }
        
        const userData = userDoc.data();
        
        // Skip if user is not active
        if (userData?.status !== "active") {
          return null;
        }

        // Get services from array field
        const services = profileData?.services || [];

        // Apply filters
        if (featured && !profileData.isFeatured) {
          return null;
        }

        if (specialization && !services.includes(specialization)) {
          return null;
        }

        if (language && !profileData.practice?.languages?.includes(language)) {
          return null;
        }

        if (minExperience && (profileData.practice?.yearsExperience || 0) < parseInt(minExperience)) {
          return null;
        }

        // Normalize hourly rate (handle both old dollar and new cents format)
        const rawRate = profileData.practice?.hourlyRate || 0;
        const normalizedRate = rawRate < 1000 ? rawRate * 100 : rawRate;

        return {
          id: therapistId,
          name: userData?.profile?.displayName || `${userData?.profile?.firstName} ${userData?.profile?.lastName}`.trim(),
          title: `${profileData.practice?.yearsExperience || 0}+ Years Exp • ${profileData.credentials?.licenseState || ''}`,
          // Prioritize photoURL from therapistProfiles, then avatarUrl from users
          image: profileData?.photoURL || userData?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.profile?.displayName || 'T')}&background=random`,
          languages: profileData.practice?.languages || [],
          specializations: services,
          experience: profileData.practice?.yearsExperience || 0,
          bio: profileData.practice?.bio || '',
          hourlyRate: normalizedRate,
          rating: 5.0, // TODO: Calculate from reviews
          reviewCount: 0, // TODO: Get from reviews collection
          isVerified: true,
          isFeatured: profileData.isFeatured || false,
          verifiedAt: profileData.verification?.verifiedAt,
          timezone: profileData.availability?.timezone || userData?.profile?.timezone || 'UTC',
        };
      })
    );

    // Filter out null values
    const verifiedTherapists = therapists.filter((t) => t !== null);

    return NextResponse.json({
      therapists: verifiedTherapists,
      total: verifiedTherapists.length,
    });
  } catch (error) {
    console.error("Error fetching public therapists:", error);
    return NextResponse.json(
      { error: "Failed to fetch therapists" },
      { status: 500 }
    );
  }
}
