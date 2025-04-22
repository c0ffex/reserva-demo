import Database from "../../db";
import { reservations } from "../../db/schemas/reservation";

export interface IReservationDeleteService {
  deleteAllReservations(): Promise<void>;
}

export class ReservationDeleteService implements IReservationDeleteService {
  constructor(private readonly db: Database) {}

  async deleteAllReservations(): Promise<void> {
    await this.db.db.delete(reservations);
  }
}
