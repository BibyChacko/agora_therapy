import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyRequestUser } from "@/lib/server/firebase-request-auth";

export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyRequestUser(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminFirestore();
    const clientId = decodedToken.uid;
    const userDoc = await db.collection("users").doc(clientId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reviewsSnapshot = await db
      .collection("reviews")
      .where("clientId", "==", clientId)
      .get();

    const reviews = reviewsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        appointmentId: data.appointmentId || "",
        rating: data.rating || 0,
        comment: data.comment || "",
        status: data.status || "pending",
      };
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching client reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch client reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyRequestUser(request);
    if (!decodedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getAdminFirestore();
    const clientId = decodedToken.uid;
    const userDoc = await db.collection("users").doc(clientId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "client") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const appointmentId =
      typeof body.appointmentId === "string" ? body.appointmentId.trim() : "";
    const rating = Number(body.rating);
    const comment =
      typeof body.comment === "string" ? body.comment.trim() : "";

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment is required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const appointmentDoc = await db
      .collection("appointments")
      .doc(appointmentId)
      .get();

    if (!appointmentDoc.exists) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appointmentData = appointmentDoc.data();

    if (!appointmentData || appointmentData.clientId !== clientId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (appointmentData.status !== "completed") {
      return NextResponse.json(
        { error: "Feedback can only be submitted after a completed session" },
        { status: 400 }
      );
    }

    const existingReviewSnapshot = await db
      .collection("reviews")
      .where("appointmentId", "==", appointmentId)
      .where("clientId", "==", clientId)
      .limit(1)
      .get();

    if (!existingReviewSnapshot.empty) {
      return NextResponse.json(
        { error: "Feedback has already been submitted for this session" },
        { status: 409 }
      );
    }

    const reviewRef = db.collection("reviews").doc();
    await reviewRef.set({
      appointmentId,
      therapistId: appointmentData.therapistId || "",
      clientId,
      rating,
      comment,
      status: "pending",
      isPublic: false,
      isAnonymous: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      metadata: {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
    });

    return NextResponse.json({
      success: true,
      reviewId: reviewRef.id,
    });
  } catch (error) {
    console.error("Error creating client review:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
