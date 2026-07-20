import jwt from "jsonwebtoken";

import { appConfig, tamaraConfig } from "@/lib/config";

const SUPPORTED_COUNTRIES = new Set(["SA", "AE", "BH", "KW", "OM"]);
const DEFAULT_SUPPORTED_CURRENCY_BY_COUNTRY: Partial<Record<string, string>> = {
  AE: "AED",
  SA: "SAR",
};

interface Money {
  amount: number;
  currency: string;
}

interface TamaraCheckoutInput {
  appointmentId: string;
  totalAmount: Money;
  shippingAmount: Money;
  taxAmount: Money;
  consumer: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    line1: string;
    line2: string;
    city: string;
    region: string;
    countryCode: string;
    phoneNumber: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    line1: string;
    line2: string;
    city: string;
    region: string;
    countryCode: string;
    phoneNumber: string;
  };
  item: {
    name: string;
    referenceId: string;
    sku: string;
    itemUrl: string;
    imageUrl?: string;
    totalAmount: Money;
    unitPrice: Money;
    taxAmount: Money;
  };
  description: string;
}

interface TamaraCheckoutResponse {
  order_id: string;
  checkout_id: string;
  checkout_url: string;
  status: string;
}

interface TamaraCheckoutPricing {
  totalAmount: Money;
  therapistFee?: Money;
  platformFee?: Money;
  originalCurrency: string;
  originalTotalAmount: number;
  exchangeRate?: number;
}

interface TamaraWebhookPayload {
  order_id: string;
  order_reference_id: string;
  order_number?: string;
  event_type: string;
  data?: unknown[];
}

class TamaraService {
  private getApiUrl() {
    return tamaraConfig.apiUrl.replace(/\/$/, "");
  }

  isEnabled() {
    return tamaraConfig.enabled && Boolean(tamaraConfig.apiToken);
  }

  private getHeaders() {
    if (!tamaraConfig.apiToken) {
      throw new Error("Tamara API token is not configured.");
    }

    return {
      Authorization: `Bearer ${tamaraConfig.apiToken}`,
      "Content-Type": "application/json",
    };
  }

  private formatMoney({ amount, currency }: Money) {
    return {
      amount: Number((amount / 100).toFixed(2)),
      currency: currency.toUpperCase(),
    };
  }

  private getLocale() {
    return "en_US";
  }

  private convertUsdMinorUnitsToAed(amount: number) {
    return Math.round(amount * tamaraConfig.usdToAedRate);
  }

  getCheckoutPricing({
    countryCode,
    totalAmount,
    therapistFee,
    platformFee,
    currency,
  }: {
    countryCode: string;
    totalAmount: number;
    therapistFee?: number;
    platformFee?: number;
    currency: string;
  }): TamaraCheckoutPricing {
    const normalizedCountryCode = countryCode.toUpperCase();
    const normalizedCurrency = currency.toUpperCase();

    if (normalizedCountryCode === "AE" && normalizedCurrency === "USD") {
      return {
        totalAmount: {
          amount: this.convertUsdMinorUnitsToAed(totalAmount),
          currency: "AED",
        },
        therapistFee:
          therapistFee === undefined
            ? undefined
            : {
                amount: this.convertUsdMinorUnitsToAed(therapistFee),
                currency: "AED",
              },
        platformFee:
          platformFee === undefined
            ? undefined
            : {
                amount: this.convertUsdMinorUnitsToAed(platformFee),
                currency: "AED",
              },
        originalCurrency: normalizedCurrency,
        originalTotalAmount: totalAmount,
        exchangeRate: tamaraConfig.usdToAedRate,
      };
    }

    return {
      totalAmount: {
        amount: totalAmount,
        currency: normalizedCurrency,
      },
      therapistFee:
        therapistFee === undefined
          ? undefined
          : {
              amount: therapistFee,
              currency: normalizedCurrency,
            },
      platformFee:
        platformFee === undefined
          ? undefined
          : {
              amount: platformFee,
              currency: normalizedCurrency,
            },
      originalCurrency: normalizedCurrency,
      originalTotalAmount: totalAmount,
    };
  }

  private assertSupportedCountry(countryCode: string) {
    if (!SUPPORTED_COUNTRIES.has(countryCode)) {
      throw new Error(
        `Tamara supports only ${Array.from(SUPPORTED_COUNTRIES).join(", ")} for checkout country codes. Received ${countryCode}.`
      );
    }
  }

  getUnsupportedCountryCurrencyMessage(countryCode: string, currency: string) {
    const normalizedCountryCode = countryCode.toUpperCase();
    const normalizedCurrency = currency.toUpperCase();
    const expectedCurrency =
      DEFAULT_SUPPORTED_CURRENCY_BY_COUNTRY[normalizedCountryCode];

    if (normalizedCountryCode === "AE" && normalizedCurrency === "USD") {
      return null;
    }

    if (expectedCurrency && normalizedCurrency !== expectedCurrency) {
      return `Tamara is currently available for ${normalizedCountryCode} checkouts in ${expectedCurrency} only. This booking is priced in ${normalizedCurrency}. Please use card payment or update the therapist pricing currency for Tamara.`;
    }

    if (!["AED", "SAR"].includes(normalizedCurrency)) {
      return `Tamara does not currently support ${normalizedCurrency} for this checkout setup. Please use card payment instead.`;
    }

    return null;
  }

  assertSupportedCountryCurrency(countryCode: string, currency: string) {
    this.assertSupportedCountry(countryCode);

    const message = this.getUnsupportedCountryCurrencyMessage(
      countryCode,
      currency
    );

    if (message) {
      throw new Error(message);
    }
  }

  async createCheckoutSession(input: TamaraCheckoutInput): Promise<TamaraCheckoutResponse> {
    const countryCode = input.shippingAddress.countryCode.toUpperCase();
    this.assertSupportedCountryCurrency(countryCode, input.totalAmount.currency);

    const returnBase = `${appConfig.url}/booking/tamara`;
    const requestBody = {
      total_amount: this.formatMoney(input.totalAmount),
      shipping_amount: this.formatMoney(input.shippingAmount),
      tax_amount: this.formatMoney(input.taxAmount),
      order_reference_id: input.appointmentId,
      order_number: input.appointmentId,
      description: input.description.slice(0, 256),
      country_code: countryCode,
      merchant_url: {
        success: `${returnBase}?appointmentId=${input.appointmentId}&status=success`,
        failure: `${returnBase}?appointmentId=${input.appointmentId}&status=failure`,
        cancel: `${returnBase}?appointmentId=${input.appointmentId}&status=cancel`,
      },
      payment_type: "PAY_BY_INSTALMENTS",
      locale: this.getLocale(),
      platform: "web",
      is_mobile: false,
      consumer: {
        first_name: input.consumer.firstName,
        last_name: input.consumer.lastName,
        phone_number: input.consumer.phoneNumber,
        email: input.consumer.email,
      },
      billing_address: {
        first_name: input.billingAddress.firstName,
        last_name: input.billingAddress.lastName,
        line1: input.billingAddress.line1,
        line2: input.billingAddress.line2,
        city: input.billingAddress.city,
        region: input.billingAddress.region,
        country_code: input.billingAddress.countryCode,
        phone_number: input.billingAddress.phoneNumber,
      },
      shipping_address: {
        first_name: input.shippingAddress.firstName,
        last_name: input.shippingAddress.lastName,
        line1: input.shippingAddress.line1,
        line2: input.shippingAddress.line2,
        city: input.shippingAddress.city,
        region: input.shippingAddress.region,
        country_code: input.shippingAddress.countryCode,
        phone_number: input.shippingAddress.phoneNumber,
      },
      items: [
        {
          name: input.item.name,
          quantity: 1,
          reference_id: input.item.referenceId,
          type: "Digital",
          sku: input.item.sku,
          item_url: input.item.itemUrl,
          image_url: input.item.imageUrl,
          unit_price: this.formatMoney(input.item.unitPrice),
          tax_amount: this.formatMoney(input.item.taxAmount),
          discount_amount: this.formatMoney({ amount: 0, currency: input.totalAmount.currency }),
          total_amount: this.formatMoney(input.item.totalAmount),
        },
      ],
    };

    console.log("Creating Tamara checkout session", {
      appointmentId: input.appointmentId,
      apiUrl: this.getApiUrl(),
      countryCode,
      currency: input.totalAmount.currency,
    });

    const response = await fetch(`${this.getApiUrl()}/checkout`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json().catch(() => null);
    console.log("Tamara checkout session response", {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseData,
    });

    if (!response.ok) {
      const message =
        (responseData as { message?: string; error?: string } | null)?.message ||
        (responseData as { message?: string; error?: string } | null)?.error ||
        "Failed to create Tamara checkout session.";
      throw new Error(message);
    }

    return responseData as TamaraCheckoutResponse;
  }

  async authoriseOrder(orderId: string) {
    console.log("Authorising Tamara order", { orderId });
    const response = await fetch(`${this.getApiUrl()}/orders/${orderId}/authorise`, {
      method: "POST",
      headers: this.getHeaders(),
    });
    const responseData = await response.json().catch(() => null);
    console.log("Tamara authorise order response", {
      orderId,
      ok: response.ok,
      status: response.status,
      responseData,
    });

    if (!response.ok) {
      const message =
        (responseData as { message?: string; error?: string } | null)?.message ||
        (responseData as { message?: string; error?: string } | null)?.error ||
        "Failed to authorise Tamara order.";
      throw new Error(message);
    }

    return responseData;
  }

  verifyWebhookToken({
    authHeader,
    queryToken,
  }: {
    authHeader: string | null;
    queryToken: string | null;
  }) {
    if (!tamaraConfig.notificationToken) {
      throw new Error("Tamara notification token is not configured.");
    }

    const authToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length).trim()
      : null;

    if (!authToken || !queryToken || authToken !== queryToken) {
      throw new Error("Tamara webhook token is missing or mismatched.");
    }

    return jwt.verify(authToken, tamaraConfig.notificationToken, {
      algorithms: ["HS256"],
    });
  }
}

export const tamaraService = new TamaraService();
export type {
  TamaraWebhookPayload,
  TamaraCheckoutPricing,
  TamaraCheckoutResponse,
};
