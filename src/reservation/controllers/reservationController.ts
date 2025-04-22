// src/controllers/reservation.controller.ts
import { Request, Response } from "express";

import { ReservationCreateService } from "../services/ReservationCreateService";
import { ReservationGetService } from "../services/ReservationGetService";
import createError from "http-errors"
import { ReservationCreateDto } from "../dtos/reservationCreateDto";

export class ReservationController {
  constructor(
    private readonly createService: ReservationCreateService,
    private readonly getService: ReservationGetService
  ) {}

  async createReservation(req: Request, res: Response) {
    try {
      const reservationData: ReservationCreateDto = req.body;
      const reservation = await this.createService.createReservation(
        reservationData
      );
      
      res.status(201).json(reservation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllReservations(req: Request, res: Response) {
    try {
      const reservations = await this.getService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReservationById(req: Request, res: Response,) {
    try {
      const id = parseInt(req.params.id);
      const reservation = await this.getService.getReservationById(id);

      if (!reservation) {
        throw createError(404, "Reservation not found")
      }

      res.status(200).json(reservation);
    } catch (error: any) {
      const statusCode = error.status || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async getReservationsByCustomerEmail(req: Request, res: Response) {
    try {
      const email = req.params.email;
      const reservations = await this.getService.getReservationsByCustomerEmail(
        email
      );
      res.status(200).json(reservations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReservationsByDateRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const reservations = await this.getService.getReservationsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.status(200).json(reservations);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

