/**
 * Available Slots Calculation Service
 * Service for calculating available appointment slots for therapists
 */

import { Timestamp } from "firebase/firestore";
import { AvailableSlot, TherapistProfile, ScheduleOverride, TimeSlot } from "@/types/database";
import { businessConfig } from "@/lib/config";
import { AvailabilityService } from "./availability-service";
import { AppointmentService } from "./appointment-service";
import { TherapistService } from "./therapist-service";
import { TimeSlotService } from "./timeslot-service";
import {
  addDays,
  format,
  startOfDay,
  endOfDay,
  isSameDay,
} from "date-fns";
import {
  convertTimezone,
  getUserTimezone,
} from "@/lib/utils/timezone-utils";

export interface SlotCalculationOptions {
  startDate: Date;
  endDate: Date;
  clientTimezone?: string;
  duration?: number; // minutes
  includeUnavailable?: boolean;
}

export interface EnhancedAvailableSlot extends AvailableSlot {
  isBooked: boolean;
  therapistTimezone: string;
  localStartTime: string;
  localEndTime: string;
  localDate: string;
  displayTime: string;
  bufferTime?: number;
  isOverride?: boolean;
}

export interface TherapistSlotsResult {
  therapistId: string;
  therapistProfile: TherapistProfile;
  availableSlots: EnhancedAvailableSlot[];
  totalSlots: number;
  bookedSlots: number;
  timezone: string;
}

interface TimeRange {
  start: string;
  end: string;
}

type WeeklyHours = Record<number, TimeRange[]>;

export class AvailableSlotsService {
  private static parseTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  private static formatMinutes(minutes: number): string {
    const normalizedHours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const normalizedMinutes = (minutes % 60).toString().padStart(2, "0");
    return `${normalizedHours}:${normalizedMinutes}`;
  }

  private static getWeeklyHours(
    therapistProfile: TherapistProfile
  ): WeeklyHours {
    const availability = therapistProfile.availability as TherapistProfile["availability"] & {
      weeklyHours?: WeeklyHours;
    };

    return availability.weeklyHours || {};
  }

  private static buildHourlySlotsFromRanges(
    ranges: TimeRange[],
    duration: number
  ): Array<{ startTime: string; endTime: string }> {
    const slots: Array<{ startTime: string; endTime: string }> = [];

    for (const range of ranges) {
      const rangeStart = this.parseTimeToMinutes(range.start);
      const rangeEnd = this.parseTimeToMinutes(range.end);

      for (
        let currentStart = rangeStart;
        currentStart + duration <= rangeEnd;
        currentStart += duration
      ) {
        slots.push({
          startTime: this.formatMinutes(currentStart),
          endTime: this.formatMinutes(currentStart + duration),
        });
      }
    }

    return slots;
  }

  private static getOverrideRanges(
    override: ScheduleOverride,
    timeSlots: TimeSlot[]
  ): TimeRange[] {
    if (!override.affectedSlots?.length) {
      return [];
    }

    return override.affectedSlots
      .map((slotId) => timeSlots.find((slot) => slot.id === slotId))
      .filter((slot): slot is TimeSlot => Boolean(slot))
      .map((slot) => ({
        start: slot.startTime,
        end: slot.endTime,
      }));
  }

  private static rangesOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ): boolean {
    const aStart = this.parseTimeToMinutes(startA);
    const aEnd = this.parseTimeToMinutes(endA);
    const bStart = this.parseTimeToMinutes(startB);
    const bEnd = this.parseTimeToMinutes(endB);

    return aStart < bEnd && bStart < aEnd;
  }

  private static applyOverridesToHourlySlots(
    baseSlots: Array<{ startTime: string; endTime: string }>,
    overrides: ScheduleOverride[],
    requestedDuration: number,
    timeSlots: TimeSlot[]
  ): {
    slots: Array<{ startTime: string; endTime: string }>;
    overrideSlotKeys: Set<string>;
  } {
    let effectiveSlots = [...baseSlots];
    const overrideSlotKeys = new Set<string>();

    for (const override of overrides) {
      if (override.type === "day_off") {
        return { slots: [], overrideSlotKeys };
      }

      const overrideRanges = this.getOverrideRanges(override, timeSlots);

      if (override.type === "time_off" && overrideRanges.length > 0) {
        effectiveSlots = effectiveSlots.filter((slot) => {
          const blocked = overrideRanges.some((range) =>
            this.rangesOverlap(
              slot.startTime,
              slot.endTime,
              range.start,
              range.end
            )
          );

          if (blocked) {
            overrideSlotKeys.add(`${slot.startTime}-${slot.endTime}`);
          }

          return !blocked;
        });
      }

      if (override.type === "custom_hours" && overrideRanges.length > 0) {
        effectiveSlots = this.buildHourlySlotsFromRanges(
          overrideRanges,
          requestedDuration
        );

        effectiveSlots.forEach((slot) => {
          overrideSlotKeys.add(`${slot.startTime}-${slot.endTime}`);
        });
      }
    }

    return { slots: effectiveSlots, overrideSlotKeys };
  }

  /**
   * Calculate available slots for a therapist within a date range
   */
  static async calculateAvailableSlots(
    therapistId: string,
    options: SlotCalculationOptions
  ): Promise<TherapistSlotsResult> {
    try {
      // Get therapist profile
      const therapistProfile = await TherapistService.getProfile(therapistId);
      if (!therapistProfile) {
        throw new Error("Therapist profile not found");
      }

      const clientTimezone = options.clientTimezone || getUserTimezone();
      const therapistTimezone = therapistProfile.availability.timezone;

      // Get all appointments in the date range
      const existingAppointments =
        await AppointmentService.getAppointmentsInRange(
          therapistId,
          options.startDate,
          options.endDate
        );

      const availableSlots: EnhancedAvailableSlot[] = [];
      const currentDate = new Date(options.startDate);

      while (currentDate <= options.endDate) {
        const daySlots = await this.calculateSlotsForDate(
          therapistId,
          therapistProfile,
          currentDate,
          existingAppointments,
          clientTimezone,
          options.duration
        );

        availableSlots.push(...daySlots);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return {
        therapistId,
        therapistProfile,
        availableSlots,
        totalSlots: availableSlots.length,
        bookedSlots: availableSlots.filter((slot) => slot.isBooked).length,
        timezone: therapistTimezone,
      };
    } catch (error) {
      console.error("Error calculating available slots:", error);
      throw new Error("Failed to calculate available slots");
    }
  }

  /**
   * Calculate available slots for a specific date
   */
  private static async calculateSlotsForDate(
    therapistId: string,
    therapistProfile: TherapistProfile,
    date: Date,
    existingAppointments: {
      scheduledFor: Timestamp;
      timeSlotId: string;
      status: string;
      duration?: number;
    }[],
    clientTimezone: string,
    requestedDuration?: number
  ): Promise<EnhancedAvailableSlot[]> {
    const slots: EnhancedAvailableSlot[] = [];

    try {
      // Calculate booking window boundaries once and apply them per slot.
      const now = new Date();
      const maxAdvanceDate = addDays(now, businessConfig.maxAdvanceBookingDays);
      const minAdvanceDate = new Date(
        now.getTime() + businessConfig.minAdvanceBookingHours * 60 * 60 * 1000
      );
      const slotDuration = 60;
      const weeklyHours = this.getWeeklyHours(therapistProfile);
      const dayRanges =
        weeklyHours[date.getDay()] || weeklyHours[Number(date.getDay())] || [];

      if (dayRanges.length === 0) {
        return slots;
      }

      const dateStart = startOfDay(date);
      const dateEnd = endOfDay(date);
      const overrides = await AvailabilityService.getScheduleOverrides(
        therapistId,
        dateStart,
        dateEnd
      );
      const allTimeSlots = await TimeSlotService.getTimeSlots();
      const baseSlots = this.buildHourlySlotsFromRanges(dayRanges, slotDuration);
      const { slots: effectiveSlots, overrideSlotKeys } =
        this.applyOverridesToHourlySlots(
          baseSlots,
          overrides,
          slotDuration,
          allTimeSlots
        );

      // Filter appointments for this specific date
      const dayAppointments = existingAppointments.filter((appointment) => {
        const appointmentDate = appointment.scheduledFor.toDate();
        return (
          isSameDay(appointmentDate, date) && appointment.status !== "cancelled"
        );
      });

      for (const slot of effectiveSlots) {
        const therapistTimezone = therapistProfile.availability.timezone;
        const slotDateTime = new Date(date);
        const [hours, minutes] = slot.startTime.split(":").map(Number);
        slotDateTime.setHours(hours, minutes, 0, 0);

        if (slotDateTime < minAdvanceDate || slotDateTime > maxAdvanceDate) {
          continue;
        }

        const slotEndDateTime = new Date(
          slotDateTime.getTime() + slotDuration * 60 * 1000
        );

        const isBooked = dayAppointments.some((appointment) => {
          const appointmentStart = appointment.scheduledFor.toDate();
          const appointmentDuration = appointment.duration || slotDuration;
          const appointmentEnd = new Date(
            appointmentStart.getTime() + appointmentDuration * 60 * 1000
          );

          return appointmentStart < slotEndDateTime && appointmentEnd > slotDateTime;
        });

        // Convert times to client timezone
        const clientSlotDateTime = convertTimezone(
          slotDateTime,
          therapistTimezone,
          clientTimezone
        );

        const endDateTime = slotEndDateTime;
        const clientEndDateTime = convertTimezone(
          endDateTime,
          therapistTimezone,
          clientTimezone
        );

        // Create enhanced available slot
        const enhancedSlot: EnhancedAvailableSlot = {
          timeSlotId: `${format(date, "yyyy-MM-dd")}:${slot.startTime}-${slot.endTime}`,
          date: clientSlotDateTime,
          startTime: slot.startTime,
          endTime: slot.endTime,
          duration: slotDuration,
          price: therapistProfile.practice.hourlyRate,
          currency: therapistProfile.practice.currency,
          isBooked,
          therapistTimezone,
          localStartTime: format(clientSlotDateTime, "HH:mm"),
          localEndTime: format(clientEndDateTime, "HH:mm"),
          localDate: format(clientSlotDateTime, "yyyy-MM-dd"),
          displayTime: `${format(clientSlotDateTime, "h:mm a")} - ${format(
            clientEndDateTime,
            "h:mm a"
          )}`,
          bufferTime: therapistProfile.availability.bufferMinutes,
          isOverride: overrideSlotKeys.has(`${slot.startTime}-${slot.endTime}`),
        };

        slots.push(enhancedSlot);
      }
    } catch (error) {
      console.error(`Error calculating slots for date ${date}:`, error);
    }

    return slots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  /**
   * Get next available slot for a therapist
   */
  static async getNextAvailableSlot(
    therapistId: string,
    fromDate: Date = new Date(),
    clientTimezone?: string
  ): Promise<EnhancedAvailableSlot | null> {
    try {
      const endDate = addDays(fromDate, businessConfig.maxAdvanceBookingDays);
      const options: SlotCalculationOptions = {
        startDate: fromDate,
        endDate,
        clientTimezone,
      };

      const result = await this.calculateAvailableSlots(therapistId, options);
      const availableSlots = result.availableSlots.filter(
        (slot) => !slot.isBooked
      );

      return availableSlots.length > 0 ? availableSlots[0] : null;
    } catch (error) {
      console.error("Error getting next available slot:", error);
      return null;
    }
  }

  /**
   * Check slot availability in real-time
   */
  static async checkSlotAvailability(
    therapistId: string,
    timeSlotId: string,
    date: Date
  ): Promise<{
    available: boolean;
    reason?: string;
    conflictingAppointment?: {
      scheduledFor: Timestamp;
      timeSlotId: string;
      status: string;
    };
  }> {
    try {
      // Get therapist availability for the date
      const availability = await AvailabilityService.getAvailabilityForDate(
        therapistId,
        date
      );

      // Check if slot is in effective slots
      if (!availability.effectiveSlots.includes(timeSlotId)) {
        return {
          available: false,
          reason: "Time slot is not available for this date",
        };
      }

      // Check for existing appointments
      const startOfDayDate = startOfDay(date);
      const endOfDayDate = endOfDay(date);
      const appointments = await AppointmentService.getAppointmentsInRange(
        therapistId,
        startOfDayDate,
        endOfDayDate
      );

      const conflicting = appointments.find(
        (appointment) =>
          appointment.timeSlotId === timeSlotId &&
          appointment.status !== "cancelled" &&
          isSameDay(appointment.scheduledFor.toDate(), date)
      );

      if (conflicting) {
        return {
          available: false,
          reason: "Time slot is already booked",
          conflictingAppointment: conflicting,
        };
      }

      return { available: true };
    } catch (error) {
      console.error("Error checking slot availability:", error);
      return {
        available: false,
        reason: "Unable to verify availability",
      };
    }
  }

  /**
   * Get available slots for multiple therapists
   */
  static async getAvailableSlotsForTherapists(
    therapistIds: string[],
    options: SlotCalculationOptions
  ): Promise<TherapistSlotsResult[]> {
    const results: TherapistSlotsResult[] = [];

    for (const therapistId of therapistIds) {
      try {
        const result = await this.calculateAvailableSlots(therapistId, options);
        results.push(result);
      } catch (error) {
        console.error(
          `Error getting slots for therapist ${therapistId}:`,
          error
        );
        // Continue with other therapists even if one fails
      }
    }

    return results;
  }

  /**
   * Find available slots matching specific criteria
   */
  static async findMatchingSlots(
    therapistIds: string[],
    criteria: {
      startDate: Date;
      endDate: Date;
      duration?: number;
      timePreferences?: string[]; // e.g., ["morning", "afternoon", "evening"]
      dayPreferences?: number[]; // 0-6 (Sunday-Saturday)
      clientTimezone?: string;
      maxResults?: number;
    }
  ): Promise<{
    slots: (EnhancedAvailableSlot & {
      therapistId: string;
      therapistProfile: TherapistProfile;
    })[];
    totalFound: number;
  }> {
    const allSlots: (EnhancedAvailableSlot & {
      therapistId: string;
      therapistProfile: TherapistProfile;
    })[] = [];

    const options: SlotCalculationOptions = {
      startDate: criteria.startDate,
      endDate: criteria.endDate,
      duration: criteria.duration,
      clientTimezone: criteria.clientTimezone,
    };

    // Get slots from all therapists
    const therapistResults = await this.getAvailableSlotsForTherapists(
      therapistIds,
      options
    );

    // Flatten and enhance slots
    for (const result of therapistResults) {
      for (const slot of result.availableSlots) {
        if (!slot.isBooked) {
          allSlots.push({
            ...slot,
            therapistId: result.therapistId,
            therapistProfile: result.therapistProfile,
          });
        }
      }
    }

    // Apply filters
    let filteredSlots = allSlots;

    // Filter by day preferences
    if (criteria.dayPreferences && criteria.dayPreferences.length > 0) {
      filteredSlots = filteredSlots.filter((slot) => {
        const dayOfWeek = slot.date.getDay();
        return criteria.dayPreferences!.includes(dayOfWeek);
      });
    }

    // Filter by time preferences
    if (criteria.timePreferences && criteria.timePreferences.length > 0) {
      filteredSlots = filteredSlots.filter((slot) => {
        const hour = slot.date.getHours();
        return criteria.timePreferences!.some((preference) => {
          switch (preference) {
            case "morning":
              return hour >= 6 && hour < 12;
            case "afternoon":
              return hour >= 12 && hour < 17;
            case "evening":
              return hour >= 17 && hour < 22;
            default:
              return true;
          }
        });
      });
    }

    // Sort by date/time
    filteredSlots.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Apply max results limit
    const maxResults = criteria.maxResults || filteredSlots.length;
    const finalSlots = filteredSlots.slice(0, maxResults);

    return {
      slots: finalSlots,
      totalFound: filteredSlots.length,
    };
  }
}

export default AvailableSlotsService;
