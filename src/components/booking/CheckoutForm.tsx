'use client';

import React, { useState } from 'react';
import {
  ExpressCheckoutElement,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import type {
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementOptions,
  StripeExpressCheckoutElementReadyEvent,
} from '@stripe/stripe-js';
import {
  trackAddPaymentInfo,
  trackException,
} from '@/lib/analytics/gtag';

interface CheckoutFormProps {
  clientSecret: string;
  appointmentId: string;
  amount: number;
  therapistFee: number;
  platformFee: number;
  currency: string;
  therapistId: string;
  therapistName: string;
  sessionType: string;
  onSuccess: () => void;
}

export default function CheckoutForm({
  clientSecret,
  appointmentId,
  amount,
  therapistFee,
  platformFee,
  currency,
  therapistId,
  therapistName,
  sessionType,
  onSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpressCheckoutVisible, setIsExpressCheckoutVisible] = useState(false);

  const lineItems: StripeExpressCheckoutElementOptions['lineItems'] = [
    {
      name: 'Therapist Fee',
      amount: therapistFee,
    },
    {
      name: 'Platform Fee',
      amount: platformFee,
    },
    {
      name: 'Total',
      amount,
    },
  ];

  const expressCheckoutOptions: StripeExpressCheckoutElementOptions = {
    buttonHeight: 48,
    emailRequired: true,
    lineItems,
    paymentMethods: {
      applePay: 'always',
      googlePay: 'auto',
      link: 'auto',
      paypal: 'never',
      amazonPay: 'never',
    },
    buttonType: {
      applePay: 'check-out',
      googlePay: 'pay',
    },
  };

  const handleExpressCheckoutReady = (
    event: StripeExpressCheckoutElementReadyEvent
  ) => {
    setIsExpressCheckoutVisible(Boolean(event.availablePaymentMethods));
  };

  const handleExpressCheckoutConfirm = async (
    event: StripeExpressCheckoutElementConfirmEvent
  ) => {
    if (!stripe || !elements) {
      event.paymentFailed({
        reason: 'fail',
        message: 'Payment is still loading. Please try again.',
      });
      return;
    }

    setMessage(null);
    setIsLoading(true);

    trackAddPaymentInfo({
      currency: currency.toUpperCase(),
      value: amount / 100,
      payment_type: event.expressPaymentType,
      items: [
        {
          item_id: therapistId,
          item_name: therapistName,
          item_category: 'therapy',
          item_category2: sessionType,
          price: amount / 100,
          quantity: 1,
        },
      ],
    });

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      setMessage(errorMessage);
      event.paymentFailed({
        reason: 'fail',
        message: errorMessage,
      });
      trackException(errorMessage || 'stripe_express_checkout_failed');
      setIsLoading(false);
      return;
    }

    onSuccess();
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setMessage(null);
    setIsLoading(true);

    trackAddPaymentInfo({
      currency: currency.toUpperCase(),
      value: amount / 100,
      payment_type: 'card',
      items: [
        {
          item_id: therapistId,
          item_name: therapistName,
          item_category: 'therapy',
          item_category2: sessionType,
          price: amount / 100,
          quantity: 1,
        },
      ],
    });

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
      trackException(error.message || 'stripe_confirm_payment_failed');
      setIsLoading(false);
    } else {
      // Payment succeeded
      onSuccess();
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <ExpressCheckoutElement
          options={expressCheckoutOptions}
          onConfirm={handleExpressCheckoutConfirm}
          onReady={handleExpressCheckoutReady}
        />

        {isExpressCheckoutVisible && (
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-400">
            <span className="h-px flex-1 bg-gray-200" />
            <span>Or pay with card</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
        )}
      </div>

      <PaymentElement />
      
      {message && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Apple Pay appears on supported devices after your Stripe payment domain is registered. Your payment is secured by Stripe.
      </p>
    </form>
  );
}
