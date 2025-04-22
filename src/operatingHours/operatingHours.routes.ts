
import express from "express";
import Database from "../db";
import { ReservationGetService } from "../reservation/services/ReservationGetService";
import { GetOperatingHoursService } from "./services/getOperatingHours";
import { GetOperatingHoursController } from "./controllers/getOperatingHoursController";

export function createOperatingHoursRouter(db: Database) {
  const router = express.Router();

  // Initialize services
  const operatingHoursService = new GetOperatingHoursService(db);
  const reservationService = new ReservationGetService(db);

  // Initialize controller
  const controller = new GetOperatingHoursController(operatingHoursService, reservationService);

  router.get("/day/:dayOfWeek", controller.getOperatingHoursByDay.bind(controller));
  router.get("/available", controller.getAvailableOperatingHours.bind(controller));

  return router;
}
