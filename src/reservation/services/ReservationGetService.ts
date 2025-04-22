// src/services/reservation.get.service.ts
import { eq, and, gte, lte, gt, lt } from "drizzle-orm";
import { reservations } from "../../db/schemas/reservation";
import Database from "../../db";
import { Reservation } from "../reservation";

export interface IReservationGetService {
  getAllReservations(): Promise<Reservation[]>;
  getReservationById(id: number): Promise<Reservation | null>;
  getReservationsByCustomerEmail(customerEmail: string): Promise<Reservation[]>;
}

export class ReservationGetService implements IReservationGetService {
  constructor(private readonly db: Database) {}

  async getAllReservations(): Promise<Reservation[]> {
    const result = await this.db.db.select().from(reservations);
    return result.map(this.mapToReservation);
  }

  async getReservationById(id: number): Promise<Reservation | null> {
    const [result] = await this.db.db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1);
    return result ? this.mapToReservation(result) : null;
  }

  async getReservationsByCustomerEmail(customerEmail: string): Promise<Reservation[]> {
    const result = await this.db.db
      .select()
      .from(reservations)
      .where(eq(reservations.customerEmail, customerEmail));
    return result.map(this.mapToReservation);
  }

  async getReservationsByDateRange(startDate: Date, endDate: Date): Promise<Reservation[]> {
    const result = await this.db.db
      .select()
      .from(reservations)
      .where(
        and(
          lt(reservations.startTime, endDate),
          gt(reservations.endTime, startDate)
        )
      );
    return result.map(this.mapToReservation);
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