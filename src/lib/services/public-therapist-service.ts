import { getAdminFirestore } from "@/lib/firebase/admin";
import { TherapistPublicView } from "@/types/models/therapist";

export interface TherapistFilters {
  specialization?: string;
  language?: string;
  minExperience?: string;
  featured?: boolean;
}

export async function getPublicTherapists(filters: TherapistFilters = {}): Promise<TherapistPublicView[]> {
  const db = getAdminFirestore();
  
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
      if (filters.featured && !profileData.isFeatured) {
        return null;
      }

      if (filters.specialization && !services.includes(filters.specialization)) {
        return null;
      }

      if (filters.language && !profileData.practice?.languages?.includes(filters.language)) {
        return null;
      }

      if (filters.minExperience && (profileData.practice?.yearsExperience || 0) < parseInt(filters.minExperience)) {
        return null;
      }

      // Normalize hourly rate (handle both old dollar and new cents format)
      const rawRate = profileData.practice?.hourlyRate || 0;
      const normalizedRate = rawRate < 1000 ? rawRate * 100 : rawRate;

      return {
        id: therapistId,
        name: userData?.profile?.displayName || `${userData?.profile?.firstName} ${userData?.profile?.lastName}`.trim(),
        title: `${profileData.practice?.yearsExperience || 0}+ Years Exp • ${profileData.credentials?.licenseState || ''}`,
        image: profileData?.photoURL || userData?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.profile?.displayName || 'T')}&background=random`,
        languages: profileData.practice?.languages || [],
        specializations: services,
        experience: profileData.practice?.yearsExperience || 0,
        bio: profileData.practice?.bio || '',
        hourlyRate: normalizedRate,
        rating: 5.0, 
        reviewCount: 0,
        isVerified: true,
        isFeatured: profileData.isFeatured || false,
        timezone: profileData.availability?.timezone || userData?.profile?.timezone || 'UTC',
      } as TherapistPublicView;
    })
  );

  // Filter out null values
  return therapists.filter((t): t is TherapistPublicView => t !== null);
}
