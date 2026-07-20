"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiCalendar, FiClock, FiCreditCard, FiCheckCircle, FiGlobe, FiInfo, FiShield, FiVideo } from 'react-icons/fi';
import { TherapistPublicView } from '@/types/models/therapist';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '@/lib/hooks/useAuth';
import CheckoutForm from '@/components/booking/CheckoutForm';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  THERAPY_SESSION_CONFIGS,
  type SupportedTherapySessionType,
} from '@/lib/session/therapy-session';
import {
  trackBeginCheckout,
  trackBookingSlotSelected,
  trackException,
  trackPurchase,
  trackViewItem,
} from '@/lib/analytics/gtag';
import {
  COMMON_TIMEZONES,
  getTimezoneAbbreviation,
  getTimezoneDisplayName,
  getUserTimezone,
} from '@/lib/utils/timezone-utils';
import { businessConfig } from '@/lib/config';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const isTamaraEnabled = process.env.NEXT_PUBLIC_TAMARA_ENABLED === 'true';

type BookingStep = 'datetime' | 'payment' | 'confirmation';
type PaymentProvider = 'stripe' | 'tamara';

interface TimeSlot {
  timeSlotId: string;
  localDate: string;
  localStartTime: string;
  localEndTime: string;
  displayTime: string;
  therapistTimezone: string;
  isOverride?: boolean;
}

interface AvailabilitySummary {
  timezone: string;
  overrideDates: string[];
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const therapistId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [therapist, setTherapist] = useState<TherapistPublicView | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<BookingStep>('datetime');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [availabilitySummary, setAvailabilitySummary] =
    useState<AvailabilitySummary | null>(null);
  const [userTimezone, setUserTimezone] = useState('UTC');
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSessionType, setSelectedSessionType] =
    useState<SupportedTherapySessionType>('single');
  const [clientNotes, setClientNotes] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>(
    isTamaraEnabled ? 'tamara' : 'stripe'
  );
  
  // Payment state
  const [clientSecret, setClientSecret] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [amount, setAmount] = useState(0);
  const [therapistFee, setTherapistFee] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const lastTrackedSlotRef = useRef<string | null>(null);
  const selectedSessionConfig =
    THERAPY_SESSION_CONFIGS.find((config) => config.value === selectedSessionType) ||
    THERAPY_SESSION_CONFIGS[0];

  const buildDateParam = useCallback((date: Date) => {
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
      0
    );

    return normalizedDate.toISOString();
  }, []);

  const fetchTherapist = useCallback(async () => {
    try {
      const response = await fetch(`/api/public/therapists/${therapistId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch therapist (${response.status})`);
      }

      const data = await response.json();
      setTherapist(data);
      const hourlyRate = data.hourlyRate / 100;
      trackViewItem({
        currency: 'AED',
        value: hourlyRate,
        items: [
          {
            item_id: data.id,
            item_name: data.name,
            item_category: 'therapy',
            item_category2: data.sessionTypes?.[0],
            price: hourlyRate,
            quantity: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching therapist:', error);
      trackException((error as Error).message || 'fetch_therapist_failed');
    } finally {
      setLoading(false);
    }
  }, [therapistId]);

  const fetchAvailabilitySummary = useCallback(async () => {
    try {
      const response = await fetch(`/api/public/therapists/${therapistId}/availability`);
      if (!response.ok) {
        throw new Error(`Failed to fetch availability summary (${response.status})`);
      }

      const data = await response.json();
      setAvailabilitySummary({
        timezone: data.timezone || 'UTC',
        overrideDates: data.overrideDates || [],
      });
    } catch (error) {
      console.error('Error fetching availability summary:', error);
    }
  }, [therapistId]);

  const fetchTimeSlots = useCallback(
    async (date: Date, duration: number) => {
      try {
        setSlotsLoading(true);
        setSlotsError('');

        const query = new URLSearchParams({
          date: buildDateParam(date),
          timezone: userTimezone,
          duration: String(duration),
        });

        const response = await fetch(
          `/api/public/therapists/${therapistId}/slots?${query.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch time slots (${response.status})`);
        }

        const data = await response.json();
        setTimeSlots(data.slots || []);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setTimeSlots([]);
        setSlotsError('Unable to load time slots for the selected date.');
      } finally {
        setSlotsLoading(false);
      }
    },
    [buildDateParam, therapistId, userTimezone]
  );

  useEffect(() => {
    setUserTimezone(getUserTimezone());
    fetchTherapist();
  }, [fetchTherapist]);

  useEffect(() => {
    if (therapistId) {
      fetchAvailabilitySummary();
    }
  }, [fetchAvailabilitySummary, therapistId]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push(`/login?redirect=/booking/${therapistId}`);
    }
  }, [authLoading, user, router, therapistId]);

  useEffect(() => {
    setSelectedTime('');

    if (!selectedDate || !therapist) {
      setTimeSlots([]);
      setSlotsError('');
      return;
    }

    fetchTimeSlots(selectedDate, selectedSessionConfig.duration);
  }, [fetchTimeSlots, selectedDate, selectedSessionConfig.duration, therapist]);

  useEffect(() => {
    setVisibleMonth((currentMonth) => currentMonth || selectedDate || null);
  }, [selectedDate]);

  useEffect(() => {
    const selectedSlot = timeSlots.find((slot) => slot.timeSlotId === selectedTime);

    if (!therapist || !selectedDate || !selectedSlot) {
      return;
    }

    const trackingKey = [
      therapist.id,
      selectedSessionType,
      selectedSlot.timeSlotId,
      selectedDate.toISOString(),
      userTimezone,
    ].join(':');

    if (lastTrackedSlotRef.current === trackingKey) {
      return;
    }

    lastTrackedSlotRef.current = trackingKey;

    trackBookingSlotSelected({
      therapist_id: therapist.id,
      therapist_name: therapist.name,
      session_type: selectedSessionType,
      slot_id: selectedSlot.timeSlotId,
      selected_date: selectedSlot.localDate,
      selected_time: selectedSlot.localStartTime,
      timezone: userTimezone,
      duration_minutes: selectedSessionConfig.duration,
    });
  }, [
    selectedDate,
    selectedSessionConfig.duration,
    selectedSessionType,
    selectedTime,
    therapist,
    timeSlots,
    userTimezone,
  ]);

  const isOverrideDate = (date: Date) => {
    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    return availabilitySummary?.overrideDates.includes(dateKey) || false;
  };

  const handleContinueToPayment = async () => {
    if (!selectedDate || !selectedTime || !therapist) {
      alert('Please select a date and time');
      return;
    }

    try {
      setLoading(true);
      
      // Combine date and time
      const selectedSlot = timeSlots.find(
        (slot) => slot.timeSlotId === selectedTime
      );

      if (!selectedSlot) {
        throw new Error('Selected time slot is invalid');
      }

      const scheduledFor = new Date(
        `${selectedSlot.localDate}T${selectedSlot.localStartTime}:00`
      );

      // Create booking
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistId: therapist.id,
          scheduledFor: scheduledFor.toISOString(),
          duration: selectedSessionConfig.duration,
          sessionType: selectedSessionType,
          clientNotes,
          paymentProvider,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to create booking');
      }

      const data = await response.json();
      setAppointmentId(data.appointmentId);
      setAmount(data.amount);
      setTherapistFee(data.therapistFee);
      setPlatformFee(data.platformFee);
      trackBeginCheckout({
        currency: 'AED',
        value: data.amount / 100,
        items: [
          {
            item_id: therapist.id,
            item_name: therapist.name,
            item_category: 'therapy',
            item_category2: selectedSessionType,
            price: data.amount / 100,
            quantity: 1,
          },
        ],
      });

      if (data.paymentProvider === 'tamara' && data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (error) {
      console.error('Error creating booking:', (error as Error).message);
      trackException((error as Error).message || 'create_booking_failed');
      alert((error as Error).message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (therapist && appointmentId) {
      trackPurchase({
        transaction_id: appointmentId,
        currency: 'AED',
        value: amount / 100,
        items: [
          {
            item_id: therapist.id,
            item_name: therapist.name,
            item_category: 'therapy',
            item_category2: selectedSessionType,
            price: amount / 100,
            quantity: 1,
          },
        ],
      });
    }
    setStep('confirmation');
  };

  // Show loading while checking auth or fetching therapist
  if (authLoading || (loading && !therapist)) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  if (!therapist) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Therapist Not Found</h1>
        <Link href="/psychologists" className="text-teal-600 hover:text-teal-700">
          Back to Therapists
        </Link>
      </div>
    );
  }

  const sessionFee = ((therapist.hourlyRate / 100) * selectedSessionConfig.duration) / 60 + 15;
  const therapistTimezone = therapist.timezone || availabilitySummary?.timezone || 'UTC';
  const selectedSlot = timeSlots.find((slot) => slot.timeSlotId === selectedTime) || null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstBookableAt = new Date(
    Date.now() + businessConfig.minAdvanceBookingHours * 60 * 60 * 1000
  );
  const minSelectableDate = new Date(firstBookableAt);
  minSelectableDate.setHours(0, 0, 0, 0);
  const bookingNotice =
    businessConfig.minAdvanceBookingHours > 0
      ? `Bookings must be scheduled at least ${businessConfig.minAdvanceBookingHours} hours in advance.`
      : 'Available future time slots can be booked as soon as they open.';
  const emptySlotsNotice =
    businessConfig.minAdvanceBookingHours > 0
      ? `No available time slots for this date. Try a later date if this day falls inside the ${businessConfig.minAdvanceBookingHours}-hour booking window.`
      : 'No available time slots for this date.';
  const selectedDateLabel = selectedDate?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const canContinueToPayment = Boolean(selectedDate && selectedTime && !loading);

  return (
    <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_26%),linear-gradient(180deg,_#f5fbff_0%,_#ffffff_55%,_#f8fcff_100%)]">
      <div className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <Link
          href={`/psychologists/${therapist.slug || therapist.id}`}
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-base text-teal-600 transition-colors hover:text-teal-700 sm:mb-8"
        >
          <FiArrowLeft className="shrink-0" /> Back to Profile
        </Link>

        <div className="mx-auto max-w-5xl">
          <div className="space-y-8">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
              <div className="mb-6 flex flex-col gap-5 border-b border-slate-100 pb-6 sm:mb-8 sm:gap-6 sm:pb-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-4 ring-teal-50">
                      <Image
                        src={therapist.image}
                        alt={therapist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.22em] text-teal-600">
                        Secure Booking
                      </p>
                      <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                        Book with {therapist.name}
                      </h1>
                      <p className="mt-2 text-base text-slate-600">
                        {therapist.title}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:min-w-[280px]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <span className="font-medium text-slate-900">Therapist timezone:</span>{' '}
                      {getTimezoneDisplayName(therapistTimezone)} ({getTimezoneAbbreviation(therapistTimezone)})
                    </div>
                  </div>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
                  <div className="flex min-w-max items-center gap-3 sm:min-w-0 sm:flex-wrap">
                    <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 sm:px-4">
                    <FiVideo className="h-4 w-4" />
                    Secure video session
                    </div>
                    <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 sm:px-4">
                    <FiShield className="h-4 w-4" />
                    Confirmation after payment
                    </div>
                    <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 sm:px-4">
                    <FiGlobe className="h-4 w-4" />
                    Localized to your timezone
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
                  <div className="flex min-w-max items-start gap-4 sm:min-w-0 sm:flex-wrap sm:items-center sm:justify-between">
                  <div className={`flex min-w-[188px] items-center gap-3 sm:min-w-0 ${step === 'datetime' ? 'text-teal-700' : step === 'payment' || step === 'confirmation' ? 'text-teal-700' : 'text-slate-400'}`}>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${step === 'datetime' || step === 'payment' || step === 'confirmation' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-slate-100 text-slate-500'}`}>
                      <FiCalendar />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Step 1</p>
                      <p className="text-sm font-semibold">Date & Time</p>
                    </div>
                  </div>
                  <div className={`hidden h-px flex-1 md:block ${step === 'payment' || step === 'confirmation' ? 'bg-teal-500' : 'bg-slate-200'}`}></div>
                  <div className={`flex min-w-[188px] items-center gap-3 sm:min-w-0 ${step === 'payment' ? 'text-teal-700' : step === 'confirmation' ? 'text-teal-700' : 'text-slate-400'}`}>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${step === 'payment' || step === 'confirmation' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-slate-100 text-slate-500'}`}>
                      <FiCreditCard />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Step 2</p>
                      <p className="text-sm font-semibold">Review & Pay</p>
                    </div>
                  </div>
                  <div className={`hidden h-px flex-1 md:block ${step === 'confirmation' ? 'bg-teal-500' : 'bg-slate-200'}`}></div>
                  <div className={`flex min-w-[172px] items-center gap-3 sm:min-w-0 ${step === 'confirmation' ? 'text-teal-700' : 'text-slate-400'}`}>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${step === 'confirmation' ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-slate-100 text-slate-500'}`}>
                      <FiCheckCircle />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Step 3</p>
                      <p className="text-sm font-semibold">Confirmed</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div>
                {step === 'datetime' && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-slate-900">Choose your session</h2>
                      <p className="text-slate-600">
                        Pick a format, then choose a date and time that works in your local timezone.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <FiInfo className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold">Timezone matched booking</p>
                          <p className="mt-1 text-blue-800">
                            You see slots in your selected timezone while the therapist works in {getTimezoneDisplayName(therapistTimezone)} ({getTimezoneAbbreviation(therapistTimezone)}).
                          </p>
                        </div>
                      </div>

                      <label className="mb-3 block text-sm font-medium text-slate-700">
                        Your timezone
                      </label>
                      <Select value={userTimezone} onValueChange={setUserTimezone}>
                        <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
                          <SelectValue placeholder="Select your timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_TIMEZONES.map((timezone) => (
                            <SelectItem key={timezone.value} value={timezone.value}>
                              {timezone.label} ({timezone.offset})
                            </SelectItem>
                          ))}
                          {!COMMON_TIMEZONES.some((timezone) => timezone.value === userTimezone) && (
                            <SelectItem value={userTimezone}>
                              {getTimezoneDisplayName(userTimezone)} ({getTimezoneAbbreviation(userTimezone)})
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <p className="mt-3 text-xs text-slate-500">
                        Selected timezone: {getTimezoneDisplayName(userTimezone)} ({getTimezoneAbbreviation(userTimezone)})
                      </p>
                    </div>

                    <div className="border-t border-dashed border-slate-200"></div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Therapy format</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Choose the format that best matches the kind of support you need.
                        </p>
                      </div>
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-2">
                      {THERAPY_SESSION_CONFIGS.map((sessionConfig) => (
                        <button
                          key={sessionConfig.value}
                          type="button"
                          onClick={() => setSelectedSessionType(sessionConfig.value)}
                          className={`group rounded-[24px] border p-4 text-left transition-all sm:p-5 ${
                            selectedSessionType === sessionConfig.value
                              ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg shadow-teal-100'
                              : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="text-base font-semibold text-slate-900 sm:text-lg">
                                {sessionConfig.label}
                              </div>
                              <div className="mt-2 text-sm leading-5 text-slate-600 sm:leading-6">
                                {sessionConfig.description}
                              </div>
                            </div>
                            <div className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                              selectedSessionType === sessionConfig.value
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {sessionConfig.duration} min
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200"></div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Date selection</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Choose the day that works best for you.
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 sm:p-2">
                        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <label className="block text-sm font-medium text-slate-700">
                              Select Date
                            </label>
                            <p className="mt-1 text-sm text-slate-500">
                              Pick one available day to continue to time selection.
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Next step
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                              {selectedDateLabel || 'Choose a date to unlock time slots'}
                            </p>
                          </div>
                        </div>
                        <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm sm:p-6">
                          <Calendar
                            mode="single"
                            selected={selectedDate || undefined}
                            onSelect={(date) => {
                              setSlotsLoading(Boolean(date));
                              setSlotsError('');
                              setTimeSlots([]);
                              setSelectedTime('');
                              setSelectedDate(date || null);
                              if (date) {
                                setVisibleMonth(date);
                              }
                            }}
                            numberOfMonths={1}
                            pagedNavigation
                            fixedWeeks
                            showOutsideDays
                            month={visibleMonth || minSelectableDate}
                            onMonthChange={setVisibleMonth}
                            disabled={[
                              { before: minSelectableDate },
                              (date: Date) => isOverrideDate(date),
                            ]}
                            className="mx-auto w-full [--cell-size:2.75rem] sm:[--cell-size:4.25rem] xl:[--cell-size:4.75rem]"
                            classNames={{
                              root: 'mx-auto w-full',
                              months: 'relative flex justify-center',
                              month: 'w-full min-w-0 max-w-3xl gap-3 sm:gap-5',
                              month_caption:
                                'mb-3 flex h-auto items-center justify-center px-10 sm:mb-6 sm:px-14',
                              caption_label: 'text-xl font-semibold leading-none text-slate-900 sm:text-2xl',
                              nav: 'absolute inset-x-0 top-0 h-10 sm:h-11',
                              button_previous:
                                'absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 sm:h-11 sm:w-11 sm:rounded-2xl',
                              button_next:
                                'absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 sm:h-11 sm:w-11 sm:rounded-2xl',
                              table: 'w-full border-collapse',
                              weekdays: 'mb-3 grid grid-cols-7 gap-2 sm:mb-4 sm:gap-3',
                              weekday:
                                'flex items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-sm sm:tracking-[0.16em]',
                              week: 'grid grid-cols-7 gap-2 mt-0 sm:gap-3',
                              day: 'aspect-auto w-full',
                              day_button:
                                'h-11 w-full rounded-xl text-sm font-semibold data-[today=true]:border data-[today=true]:border-slate-200 data-[today=true]:bg-slate-100 data-[today=true]:text-slate-900 sm:h-16 sm:rounded-2xl sm:text-base xl:h-[4.75rem]',
                              today:
                                'text-slate-900',
                              selected:
                                'bg-teal-600 text-white hover:bg-teal-600 focus:bg-teal-600 rounded-xl sm:rounded-2xl',
                              disabled: 'text-slate-300 opacity-100',
                              outside: 'text-slate-300 opacity-70',
                            }}
                          />
                        </div>
                        <p className="mt-4 text-sm text-slate-500">
                          {bookingNotice}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200"></div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Time selection</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {selectedDateLabel || 'Choose a date to unlock available times in your timezone.'}
                        </p>
                      </div>
                      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700">
                              Select Time
                            </label>
                            <p className="mt-1 text-sm text-slate-500">
                              All times below are shown in {getTimezoneAbbreviation(userTimezone)}
                            </p>
                          </div>
                          {selectedSlot && (
                            <div className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                              Selected
                            </div>
                          )}
                        </div>

                        {selectedDate ? (
                          <>
                            {slotsLoading ? (
                              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                                Loading available time slots...
                              </div>
                            ) : slotsError ? (
                              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {slotsError}
                              </div>
                            ) : timeSlots.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
                                {emptySlotsNotice}
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                {timeSlots.map((slot) => (
                                  <button
                                    key={slot.timeSlotId}
                                    onClick={() => setSelectedTime(slot.timeSlotId)}
                                    className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${
                                      selectedTime === slot.timeSlotId
                                        ? 'border-teal-600 bg-teal-600 text-white shadow-lg shadow-teal-200'
                                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-teal-300 hover:bg-teal-50'
                                    }`}
                                  >
                                    {slot.displayTime}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
                            Please select a date first
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200"></div>

                    <div className="space-y-5">
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                        <label className="mb-3 block text-sm font-medium text-slate-700">
                          Notes for Therapist (Optional)
                        </label>
                        <Textarea
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          rows={4}
                          className="min-h-[120px] rounded-2xl border-slate-200 bg-white"
                          placeholder="Share any concerns, goals, or context you'd like the therapist to know before the session..."
                        />
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Payment Method
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Choose how you&apos;d like to complete payment for this booking.
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setPaymentProvider('stripe')}
                            className={`rounded-2xl border p-4 text-left transition-all ${
                              paymentProvider === 'stripe'
                                ? 'border-teal-500 bg-white shadow-md'
                                : 'border-slate-200 bg-white hover:border-teal-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-slate-900">Card Payment</p>
                                <p className="mt-1 text-sm text-slate-600">
                                  Pay now with your credit or debit card.
                                </p>
                              </div>
                              <FiCreditCard className="h-5 w-5 text-slate-500" />
                            </div>
                          </button>

                          {isTamaraEnabled && (
                            <button
                              type="button"
                              onClick={() => setPaymentProvider('tamara')}
                              className={`rounded-2xl border p-4 text-left transition-all ${
                                paymentProvider === 'tamara'
                                  ? 'border-teal-500 bg-white shadow-md'
                                  : 'border-slate-200 bg-white hover:border-teal-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-900">Tamara</p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    Continue to Tamara to pay in instalments.
                                  </p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                  BNPL
                                </span>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Cancellation Policy
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Free cancellation up to 24 hours before the appointment. Cancellations within 24 hours incur a 50% charge.
                        </p>
                      </div>

                      <button
                        onClick={handleContinueToPayment}
                        disabled={!canContinueToPayment}
                        className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-100 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading
                          ? 'Processing...'
                          : paymentProvider === 'tamara'
                          ? 'Continue to Tamara'
                          : 'Continue to Payment'}
                      </button>
                    </div>
                  </div>
                )}

                {step === 'payment' && clientSecret && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-slate-900">Review & Pay</h2>
                      <p className="text-slate-600">
                        Check your session details, then complete payment to confirm your booking.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Booking Summary</h3>
                      <div className="grid gap-3 text-sm sm:grid-cols-2">
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Date</span>
                          <p className="mt-1 font-medium text-slate-900">{selectedDateLabel}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Time</span>
                          <p className="mt-1 font-medium text-slate-900">{selectedSlot?.displayTime || ''}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Timezone</span>
                          <p className="mt-1 font-medium text-slate-900">
                            {getTimezoneDisplayName(userTimezone)} ({getTimezoneAbbreviation(userTimezone)})
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Format</span>
                          <p className="mt-1 font-medium text-slate-900">{selectedSessionConfig.label}</p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Therapist Fee</span>
                          <span className="font-medium text-slate-900">${(therapistFee / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Platform Fee</span>
                          <span className="font-medium text-slate-900">${(platformFee / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
                          <span>Total</span>
                          <span>${(amount / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm
                        clientSecret={clientSecret}
                        appointmentId={appointmentId}
                        amount={amount}
                        currency="aed"
                        therapistId={therapist.id}
                        therapistName={therapist.name}
                        sessionType={selectedSessionType}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  </div>
                )}

                {step === 'confirmation' && (
                  <div className="py-4 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-green-100 text-green-600 shadow-[0_18px_45px_rgba(34,197,94,0.18)]">
                      <FiCheckCircle size={44} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h2>
                    <p className="mx-auto mt-4 max-w-xl text-slate-600">
                      Your appointment with {therapist.name} has been booked successfully. We&apos;ll email the meeting link, meeting ID, and passcode after payment confirmation.
                    </p>

                    <div className="mx-auto mt-8 max-w-xl rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-left">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Appointment Details</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Therapist</span>
                          <p className="mt-1 font-medium text-slate-900">{therapist.name}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Session Type</span>
                          <p className="mt-1 font-medium text-slate-900">{selectedSessionConfig.label}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Date</span>
                          <p className="mt-1 font-medium text-slate-900">{selectedDateLabel}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <span className="text-slate-500">Time</span>
                          <p className="mt-1 font-medium text-slate-900">{selectedSlot?.displayTime || ''}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 sm:col-span-2">
                          <span className="text-slate-500">Timezone</span>
                          <p className="mt-1 font-medium text-slate-900">
                            {getTimezoneDisplayName(userTimezone)} ({getTimezoneAbbreviation(userTimezone)})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                      <Link
                        href="/client/appointments"
                        className="rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-100 transition hover:opacity-95"
                      >
                        View My Appointments
                      </Link>
                      <Link
                        href="/"
                        className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Return to Homepage
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
