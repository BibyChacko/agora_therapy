"use client";

export const normalizeCurrencyCode = (currency?: string) =>
  (currency || "USD").toUpperCase();

export const amountFromMinorUnits = (amount?: number) => {
  return (amount || 0) / 100;
};

export const formatAmountFromMinorUnits = (amount?: number, currency?: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: normalizeCurrencyCode(currency),
  }).format(amountFromMinorUnits(amount));
};
