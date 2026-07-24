/**
 * Manually sync USD exchange rates from Frankfurter into Firestore.
 *
 * Usage:
 * npm run sync:exchange-rates
 */
export {};

const nodeFs = require("fs");
const nodePath = require("path");

const envPaths = [".env.local", ".env"]
  .map((file) => nodePath.resolve(process.cwd(), file))
  .filter((file) => nodeFs.existsSync(file));

for (const envPath of envPaths) {
  require("dotenv").config({ path: envPath, override: false });
}

const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

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
    const serviceAccountPath = nodePath.join(
      __dirname,
      "..",
      "google_services.json"
    );

    if (nodeFs.existsSync(serviceAccountPath)) {
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
const EXCHANGE_RATES_COLLECTION = "exchangeRates";
const BASE_CURRENCY = "USD";

interface FrankfurterRateRow {
  date?: string;
  base?: string;
  quote?: string;
  rate?: number;
}

interface FrankfurterRatesObject {
  base?: string;
  date?: string;
  rates?: Record<string, number>;
}

function normalizeCurrencyCode(currency: string | undefined) {
  return String(currency || BASE_CURRENCY).toUpperCase();
}

function normalizeFrankfurterRates(
  payload: FrankfurterRateRow[] | FrankfurterRatesObject
) {
  if (Array.isArray(payload)) {
    const firstRow = payload[0] || {};
    const baseCurrency = normalizeCurrencyCode(firstRow.base || BASE_CURRENCY);
    const date = firstRow.date || new Date().toISOString().slice(0, 10);
    const rates: Record<string, number> = {
      [baseCurrency]: 1,
    };

    for (const row of payload) {
      if (
        row &&
        typeof row.quote === "string" &&
        typeof row.rate === "number"
      ) {
        rates[normalizeCurrencyCode(row.quote)] = row.rate;
      }
    }

    return {
      baseCurrency,
      date,
      rates,
    };
  }

  const baseCurrency = normalizeCurrencyCode(payload?.base || BASE_CURRENCY);

  return {
    baseCurrency,
    date: payload?.date || new Date().toISOString().slice(0, 10),
    rates: {
      [baseCurrency]: 1,
      ...(payload?.rates || {}),
    },
  };
}

async function syncExchangeRates() {
  const url = new URL("https://api.frankfurter.dev/v2/rates");
  url.searchParams.set("base", BASE_CURRENCY);

  console.log(`Fetching rates from ${url.toString()}`);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Frankfurter request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as
    | FrankfurterRateRow[]
    | FrankfurterRatesObject;
  const normalized = normalizeFrankfurterRates(payload);

  await db
    .collection(EXCHANGE_RATES_COLLECTION)
    .doc(BASE_CURRENCY)
    .set(
      {
        baseCurrency: normalized.baseCurrency,
        date: normalized.date,
        provider: "frankfurter",
        rates: normalized.rates,
        fetchedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  console.log(
    `Synced ${Object.keys(normalized.rates).length} currencies for ${
      normalized.baseCurrency
    } on ${
      normalized.date
    }.`
  );
}

syncExchangeRates()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to sync exchange rates:", error);
    process.exit(1);
  });
