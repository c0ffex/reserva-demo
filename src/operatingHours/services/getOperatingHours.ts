// src/services/operatingHours.service.ts
import Database from "../../db";
import { operatingHours } from "../../db/schemas/operatingHours";
import { OperatingHours, OperatingHoursCreateDto } from "../operatingHours";
import { eq } from "drizzle-orm";
import { TimeSlot } from "../timeSlots";

export interface IOperatingHoursService {
  getOperatingHoursByDay(dayOfWeek: number): Promise<OperatingHours[]>;
  getAvailableOperatingHoursForDate(
    date: Date,
    reservationService: { getReservationsByDateRange: (start: Date, end: Date) => Promise<any[]>; },
    threshold: number
  ): Promise<TimeSlot[]>;
}

export class GetOperatingHoursService implements IOperatingHoursService {
  constructor(private readonly db: Database) {}

  async createOperatingHours(data: OperatingHoursCreateDto): Promise<OperatingHours> {
    try {
      const [result] = await this.db.db
        .insert(operatingHours)
        .values(data)
        .returning();
      return this.mapToOperatingHours(result);
    } catch (error: any) {
      throw new Error(`Failed to create operating hours: ${error.message}`);
    }
  }

  async getOperatingHoursByDay(dayOfWeek: number): Promise<OperatingHours[]> {
    const results = await this.db.db
      .select()
      .from(operatingHours)
      .where(eq(operatingHours.dayOfWeek, dayOfWeek));
    return results.map(this.mapToOperatingHours);
  }

  async getAvailableOperatingHoursForDate(
    date: Date,
    reservationService: { getReservationsByDateRange: (start: Date, end: Date) => Promise<any[]>; },
    threshold: number
  ): Promise<TimeSlot[]> {
    // Convert input date to UTC
    const utcDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ));

    const dayOfWeek = utcDate.getUTCDay();
    const operatingSlots = await this.getOperatingHoursByDay(dayOfWeek);
    const allTimeSlots: TimeSlot[] = [];

    operatingSlots.forEach(slot => 
      this.generateTimeSlots(slot, utcDate, threshold, allTimeSlots)
    );
    // Get full UTC day range
    const startOfDay = new Date(utcDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(utcDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const reservationsForDay = await reservationService.getReservationsByDateRange(startOfDay, endOfDay);
    
    const bookedSlots = new Set<string>(
      reservationsForDay.map(reservation => {
        const d = new Date(reservation.startTime);
        return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
      })
    );

    return allTimeSlots.filter(slot => !bookedSlots.has(slot.time));
  }

  private generateTimeSlots(
    slot: OperatingHours,
    utcDate: Date,
    threshold: number,
    allTimeSlots: TimeSlot[]
  ): void {
    const [openHour, openMinute] = slot.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = slot.closeTime.split(':').map(Number);
  
    const startTime = new Date(utcDate);
    startTime.setUTCHours(openHour, openMinute, 0, 0);
    const endTime = new Date(utcDate);
    endTime.setUTCHours(closeHour, closeMinute, 0, 0);
  
    for (
      let current = new Date(startTime);
      current <= endTime;
      current.setUTCMinutes(current.getUTCMinutes() + threshold)
    ) {
      const hour = current.getUTCHours().toString().padStart(2, '0');
      const minute = current.getUTCMinutes().toString().padStart(2, '0');
      allTimeSlots.push(new TimeSlot(`${hour}:${minute}`));
    }
  }

  private mapToOperatingHours(data: any): OperatingHours {
    return {
      id: data.id,
      dayOfWeek: data.dayOfWeek,
      openTime: data.openTime,
      closeTime: data.closeTime,
      isClosed: data.isClosed
    };
  }
}