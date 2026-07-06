import { NextRequest } from "next/server";

import { getAdminAuth } from "@/lib/firebase/admin";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function verifyRequestUser(request: NextRequest) {
  const token =
    request.cookies.get("auth-token")?.value || getBearerToken(request);

  if (!token) {
    return null;
  }

  return getAdminAuth().verifyIdToken(token);
}
