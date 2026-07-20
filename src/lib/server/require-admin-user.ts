import { NextRequest } from "next/server";

import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin";

export async function requireAdminUser(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) {
    throw new Error("Unauthorized");
  }

  const auth = getAdminAuth();
  const db = getAdminFirestore();
  const decodedToken = await auth.verifyIdToken(token);
  const userDoc = await db.collection("users").doc(decodedToken.uid).get();
  const userData = userDoc.data();

  if (!userData || userData.role !== "admin") {
    throw new Error("Forbidden");
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email || null,
  };
}
