// src/controllers/operatingHours.controller.ts
import { Request, Response } from "express";
import createError from "http-errors";
import { GetOperatingHoursService } from "../services/getOperatingHours";
import { ReservationGetService } from "../../reservation/services/ReservationGetService";

export class GetOperatingHoursController {
  constructor(
    private readonly operatingHoursService: GetOperatingHoursService,
    private readonly reservationService: ReservationGetService
  ) {}

  async getOperatingHoursByDay(req: Request, res: Response) {
    try {
      const dayOfWeek = parseInt(req.params.dayOfWeek);
      const operatingHoursRecords = await this.operatingHoursService.getOperatingHoursByDay(dayOfWeek);
      res.status(200).json(operatingHoursRecords);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAvailableOperatingHours(req: Request, res: Response) {
    try {
      const dateStr = req.query.date as string;
      const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 60;
      
      if (!dateStr) {
        throw createError(400, "Date query parameter is required");
      }
      
      const date = new Date(dateStr);
      const availableHours = await this.operatingHoursService.getAvailableOperatingHoursForDate(
        date,
        this.reservationService,
        threshold
      );
      
      res.status(200).json(availableHours);
    } catch (error: any) {
      res.status(error.status || 500).json({ error: error.message });
    }
  }
}
