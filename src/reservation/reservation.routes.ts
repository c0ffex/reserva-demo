
import express from 'express';
import { ReservationCreateService } from './services/ReservationCreateService';
import { ReservationController } from './controllers/reservationController';
import { ReservationGetService } from './services/ReservationGetService';
import Database from '../db';


export function createReservationRouter(db: Database) {
  const router = express.Router();
  
  // Initialize services
  const createService = new ReservationCreateService(db);
  const getService = new ReservationGetService(db);
  
  // Initialize controller
  const controller = new ReservationController(createService, getService);

  // Define routes
  router.post('/', controller.createReservation.bind(controller));
  router.get('/', controller.getAllReservations.bind(controller));
  router.get('/:id', controller.getReservationById.bind(controller));
  router.get('/customer/:email', controller.getReservationsByCustomerEmail.bind(controller));
  router.get('/date-range', controller.getReservationsByDateRange.bind(controller));

  return router;
}