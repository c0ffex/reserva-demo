import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Database from '../../db';
import { ReservationCreateService } from './ReservationCreateService';
import { ReservationDeleteService } from './ReservationDeleteService';
import { ReservationGetService } from './ReservationGetService';

describe("ReservationService Integration Tests", () => {
  let db: Database;
  let createService: ReservationCreateService;
  let deleteService: ReservationDeleteService;
  let getService: ReservationGetService;
  
  const futureTime = (hoursFromNow: number) => 
    new Date(Date.now() + (hoursFromNow * 3600000));

  beforeAll(async () => {
    db = new Database();
    await db.connect();
    createService = new ReservationCreateService(db);
    deleteService = new ReservationDeleteService(db);
    getService = new ReservationGetService(db)
  });

  beforeEach(async () => {
    await deleteService.deleteAllReservations();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it("should create and retrieve a reservation", async () => {
    const reservationData = {
      customerEmail: "john@example.com",
      customerName: "John Doe",
      customerPhone: "+15551234",
      partySize: 4,
      startTime: futureTime(1),
      endTime: futureTime(2),
      status: "confirmed" as const
    };
  
    const createdReservation = await createService.createReservation(reservationData);
    
    expect(createdReservation).toMatchObject({
      customerEmail: reservationData.customerEmail,
      customerName: reservationData.customerName,
      customerPhone: reservationData.customerPhone,
      partySize: reservationData.partySize,
      status: reservationData.status
    });
    
    expect(createdReservation.startTime.getTime())
      .toBeCloseTo(reservationData.startTime.getTime(), -3);
    expect(createdReservation.endTime.getTime())
      .toBeCloseTo(reservationData.endTime.getTime(), -3);
  });
  
  it("should persist exactly one reservation", async () => {
    const initialCount = (await getService.getAllReservations()).length;
    
    await createService.createReservation({
      customerEmail: "test@example.com",
      customerName: "Test User",
      customerPhone: "+15559876",
      partySize: 2,
      startTime: futureTime(3),
      endTime: futureTime(4),
      status: "confirmed"
    });
  
    const allReservations = await getService.getAllReservations();
    expect(allReservations).toHaveLength(initialCount + 1);
  });

  it("should prevent overlapping reservations", async () => {
    const firstReservation = {
      customerEmail: "test@example.com",
      customerName: "First",
      customerPhone: "+11111111",
      partySize: 2,
      startTime: futureTime(1),
      endTime: futureTime(3)
    };

    await createService.createReservation(firstReservation);

    const overlappingReservation = {
      customerEmail: "test@example.com",
      customerName: "Second",
      customerPhone: "+22222222",
      partySize: 3,
      startTime: futureTime(2),
      endTime: futureTime(4)
    };

    await expect(createService.createReservation(overlappingReservation))
      .rejects.toThrow("Time slot already booked");
  });

  it("should allow non-overlapping reservations", async () => {
    const firstReservation = {
      customerEmail: "early@example.com",
      customerName: "Early",
      customerPhone: "+33333333",
      partySize: 2,
      startTime: futureTime(1),
      endTime: futureTime(2)
    };

    const secondReservation = {
      customerEmail: "later@example.com",
      customerName: "Later",
      customerPhone: "+44444444",
      partySize: 3,
      startTime: futureTime(3),
      endTime: futureTime(4)
    };

    await createService.createReservation(firstReservation);
    await createService.createReservation(secondReservation);

    const allReservations = await getService.getAllReservations();
    expect(allReservations.length).toBe(2);
  });

  it("should validate startTime is before endTime", async () => {
    const invalidReservation = {
      customerEmail: "test@example.com",
      customerName: "Invalid",
      customerPhone: "+55555555",
      partySize: 2,
      startTime: futureTime(2),
      endTime: futureTime(1)
    };

    await expect(createService.createReservation(invalidReservation))
      .rejects.toThrow();
  });
});