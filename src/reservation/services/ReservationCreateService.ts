// src/services/reservation.create.service.ts
import { and, gt, lt } from "drizzle-orm";
import Database from "../../db";
import { reservations } from "../../db/schemas/reservation";
import { Reservation } from "../reservation";
import { ReservationCreateDto } from "../dtos/reservationCreateDto";

export interface IReservationCreateService {
  createReservation(data: ReservationCreateDto): Promise<Reservation>;
}

export class ReservationCreateService implements IReservationCreateService {
  constructor(private readonly db: Database) {}

  
  async createReservation(data: ReservationCreateDto): Promise<Reservation> {
    data.startTime = new Date(data.startTime);
    data.endTime = new Date(data.endTime);

    this.validateReservationDate(data);
    await this.checkTimeSlotAvailability(data);

    try {
      const [result] = await this.db.db
        .insert(reservations)
        .values(data)
        .returning();
      return this.mapToReservation(result);
    } catch (error: any) {
      throw new Error(`Failed to create reservation: ${error.message}`);
    }
  }

  private validateReservationDate(data: ReservationCreateDto) {
    if (data.startTime >= data.endTime) {
      throw new Error("startTime must be before endTime");
    }
  }

  private async checkTimeSlotAvailability(data: ReservationCreateDto) {
    const conflictingReservations = await this.db.db
      .select()
      .from(reservations)
      .where(
        and(
          lt(reservations.startTime, data.endTime),
          gt(reservations.endTime, data.startTime)
        )
      );

    if (conflictingReservations.length > 0) {
      throw new Error("Time slot already booked");
    }
  }

  private mapToReservation(data: any): Reservation {
    return {
      id: data.id,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: data.status,
      partySize: data.partySize,
      notes: data.notes,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }
}