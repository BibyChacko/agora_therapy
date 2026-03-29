import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";

/**
 * GET /api/admin/users
 * Fetch all users
 */
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [Admin Users API] Starting fetch users request");
    
    // Verify admin authentication
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      console.warn("⚠️ [Admin Users API] No auth-token cookie found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🔍 [Admin Users API] Token found, initializing Admin SDK");
    const auth = getAdminAuth();
    const db = getAdminFirestore();
    
    console.log("🔍 [Admin Users API] Verifying ID token...");
    const decodedToken = await auth.verifyIdToken(token);
    console.log(`🔍 [Admin Users API] Token verified for UID: ${decodedToken.uid}`);

    console.log("🔍 [Admin Users API] Checking user role in Firestore...");
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      console.error(`❌ [Admin Users API] User document not found for UID: ${decodedToken.uid}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userData = userDoc.data();
    console.log(`🔍 [Admin Users API] User role: ${userData?.role}`);

    if (!userData || userData.role !== "admin") {
      console.warn(`⚠️ [Admin Users API] User ${decodedToken.uid} is not an admin`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users from Firestore
    console.log("🔍 [Admin Users API] Fetching all users from 'users' collection...");
    const usersSnapshot = await db
      .collection("users")
      .orderBy("metadata.createdAt", "desc")
      .get();
    
    console.log(`✅ [Admin Users API] Successfully fetched ${usersSnapshot.size} users`);

    const users = usersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || "",
        profile: {
          displayName: data.profile?.displayName || "",
          firstName: data.profile?.firstName || "",
          lastName: data.profile?.lastName || "",
          phoneNumber: data.profile?.phoneNumber || "",
          avatarUrl: data.profile?.avatarUrl || "",
        },
        role: data.role || "client",
        status: data.status || "active",
        metadata: {
          createdAt: data.metadata?.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          lastLoginAt: data.metadata?.lastLoginAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        },
      };
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("❌ [Admin Users API] Error in GET /api/admin/users:", error);
    if (error.code) console.error("❌ [Admin Users API] Error code:", error.code);
    if (error.stack) console.error("❌ [Admin Users API] Stack trace:", error.stack);
    
    return NextResponse.json(
      { error: "Failed to fetch users", details: error.message },
      { status: 500 }
    );
  }
}
