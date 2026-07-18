"use client";

import { jsPDF } from "jspdf";
import { Appointment } from "@/types/database";
import {
  formatAmountFromMinorUnits,
  normalizeCurrencyCode,
} from "@/lib/utils/currency";

type InvoicePdfOptions = {
  appointment: Appointment;
  clientName?: string;
  clientEmail?: string;
};

const BRAND_NAME = "Mindgood Therapy";
const BRAND_WEBSITE = "www.mindgood.com";
const BRAND_EMAIL = "support@mindgood.com";
const LOGO_PATH = "/Mindgood.png";

const formatDate = (value: unknown) => {
  const date =
    typeof value === "object" && value !== null && "toDate" in value
      ? (value as { toDate: () => Date }).toDate()
      : new Date(value as string | number | Date);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (value: unknown) => {
  const date =
    typeof value === "object" && value !== null && "toDate" in value
      ? (value as { toDate: () => Date }).toDate()
      : new Date(value as string | number | Date);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toTitleCase = (value?: string) => {
  if (!value) return "Therapy Session";

  return value
    .replace(/[_-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getTherapistDisplayName = (appointment: Appointment) => {
  return appointment.therapist?.name || appointment.therapistId || "Therapist";
};

const fileToDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadLogoDataUrl = async () => {
  try {
    const response = await fetch(LOGO_PATH);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await fileToDataUrl(blob);
  } catch (error) {
    console.error("Error loading invoice logo:", error);
    return null;
  }
};

const drawSectionLabel = (doc: jsPDF, label: string, x: number, y: number) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(38, 84, 124);
  doc.text(label.toUpperCase(), x, y);
};

const drawMutedText = (doc: jsPDF, text: string, x: number, y: number) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(text, x, y);
};

const drawBodyText = (doc: jsPDF, text: string, x: number, y: number) => {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text(text, x, y);
};

const drawLabelValue = (
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number
) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text(`${label}:`, x, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(31, 41, 55);
  doc.text(value, x + 32, y);
};

export async function generateInvoicePdf({
  appointment,
  clientName,
  clientEmail,
}: InvoicePdfOptions) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const issueDate =
    typeof appointment.metadata?.createdAt === "object" &&
    appointment.metadata?.createdAt !== null &&
    "toDate" in appointment.metadata.createdAt
      ? appointment.metadata.createdAt.toDate()
      : new Date();
  const invoiceNumber = `INV-${appointment.id.slice(0, 8).toUpperCase()}`;
  const sessionAmount = appointment.payment?.amount || 0;
  const currency = normalizeCurrencyCode(appointment.payment?.currency);
  const sessionType = toTitleCase(appointment.session?.type);
  const deliveryType = toTitleCase(appointment.session?.deliveryType || "video");
  const paymentStatus = toTitleCase(appointment.payment?.status || "pending");
  const logoDataUrl = await loadLogoDataUrl();
  const therapistName = getTherapistDisplayName(appointment);

  doc.setFillColor(245, 249, 255);
  doc.rect(0, 0, width, 38, "F");
  doc.setDrawColor(211, 227, 253);
  doc.line(0, 38, width, 38);

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 16, 10, 24, 12);
  } else {
    doc.setFillColor(38, 84, 124);
    doc.roundedRect(16, 10, 24, 12, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("M", 27, 18.5, { align: "center" });
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text(BRAND_NAME, 44, 17);

  drawMutedText(doc, BRAND_WEBSITE, 44, 23);
  drawMutedText(doc, BRAND_EMAIL, 44, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(38, 84, 124);
  doc.text("INVOICE", width - 16, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(`Invoice #: ${invoiceNumber}`, width - 16, 25, { align: "right" });
  doc.text(`Issued: ${formatDate(issueDate)}`, width - 16, 30, { align: "right" });

  drawSectionLabel(doc, "Billed To", 16, 52);
  drawBodyText(doc, clientName || "Client", 16, 59);
  if (clientEmail) {
    drawMutedText(doc, clientEmail, 16, 65);
  }

  drawSectionLabel(doc, "Appointment Details", 16, 80);
  drawLabelValue(doc, "Date", formatDate(appointment.scheduledFor), 16, 88);
  drawLabelValue(doc, "Time", formatTime(appointment.scheduledFor), 16, 95);
  drawLabelValue(doc, "Duration", `${appointment.duration || 60} minutes`, 16, 102);
  drawLabelValue(doc, "Session", sessionType, 16, 109);
  drawLabelValue(doc, "Delivery", deliveryType, 16, 116);
  drawLabelValue(doc, "Therapist", therapistName, 16, 123);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(16, 136, width - 32, 44, 3, 3, "FD");

  doc.setFillColor(238, 246, 255);
  doc.roundedRect(16, 136, width - 32, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(31, 41, 55);
  doc.text("Description", 20, 142.5);
  doc.text("Amount", width - 20, 142.5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(`${sessionType} (${appointment.duration || 60} min)`, 20, 155);
  doc.text(formatAmountFromMinorUnits(sessionAmount, currency), width - 20, 155, {
    align: "right",
  });

  doc.setDrawColor(229, 231, 235);
  doc.line(20, 161, width - 20, 161);

  doc.setFont("helvetica", "bold");
  doc.text("Total", 20, 172);
  doc.setTextColor(38, 84, 124);
  doc.text(formatAmountFromMinorUnits(sessionAmount, currency), width - 20, 172, {
    align: "right",
  });

  drawSectionLabel(doc, "Payment Summary", 16, 194);
  drawLabelValue(doc, "Status", paymentStatus, 16, 202);
  drawLabelValue(
    doc,
    "Method",
    appointment.payment?.method
      ? toTitleCase(appointment.payment.method)
      : "Not specified",
    16,
    209
  );
  drawLabelValue(
    doc,
    "Transaction",
    appointment.payment?.transactionId || "Not available",
    16,
    216
  );
  drawLabelValue(doc, "Appointment ID", appointment.id, 16, 223);

  doc.setDrawColor(229, 231, 235);
  doc.line(16, height - 28, width - 16, height - 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  const footerText =
    "Thank you for choosing Mindgood Therapy. This invoice is generated electronically and is valid without a signature.";
  doc.text(doc.splitTextToSize(footerText, width - 32), 16, height - 20);

  doc.save(`invoice-${appointment.id}.pdf`);
}
