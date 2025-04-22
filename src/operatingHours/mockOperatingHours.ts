// src/services/getOperatingHours.test.ts
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import Database from "../db";
import { GetOperatingHoursService } from "./services/getOperatingHours";
import { TimeSlot } from "./timeSlots";

describe("GetOperatingHoursService with mock data", () => {
  let service: GetOperatingHoursService;
  let db: Database;
  const mockReservationService = {
    getReservationsByDateRange: vi.fn().mockResolvedValue([])
  };

  beforeAll(async () => {
    db = new Database();
    await db.connect();
    service = new GetOperatingHoursService(db);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe("getOperatingHoursByDay", () => {
    it("should return mock data for Thursday (day 4)", async () => {
      const result = await service.getOperatingHoursByDay(4);
      expect(result).toEqual([
        {
          id: expect.any(Number),
          dayOfWeek: 4,
          openTime: "12:00",
          closeTime: "15:00",
          isClosed: false
        }
      ]);
    });

    it("should return empty array for Sunday (day 0)", async () => {
      const result = await service.getOperatingHoursByDay(0);
      expect(result).toEqual([]);
    });
  });

  describe("getAvailableOperatingHoursForDate", () => {
    it("should generate correct time slots for Tuesday (day 2)", async () => {
      const testDate = new Date("2023-10-10"); // Tuesday (day 2)
      const result = await service.getAvailableOperatingHoursForDate(
        testDate,
        mockReservationService,
        60
      );
      
      expect(result).toEqual([
        new TimeSlot("12:00"),
        new TimeSlot("13:00"),
        new TimeSlot("14:00")
      ]);
    });

    it("should exclude booked time slots", async () => {
      const testDate = new Date("2023-10-11"); // Wednesday (day 3)
      mockReservationService.getReservationsByDateRange.mockResolvedValueOnce([{
        startTime: new Date("2023-10-11T13:00:00"),
        endTime: new Date("2023-10-11T14:00:00")
      }]);

      const result = await service.getAvailableOperatingHoursForDate(
        testDate,
        mockReservationService,
        60
      );

      expect(result).toEqual([
        new TimeSlot("12:00"),
        new TimeSlot("14:00")
      ]);
    });

    it("should handle 30-minute intervals correctly", async () => {
      const testDate = new Date("2023-10-09"); // Monday (day 1)
      const result = await service.getAvailableOperatingHoursForDate(
        testDate,
        mockReservationService,
        30
      );

      expect(result).toEqual([
        new TimeSlot("12:00"),
        new TimeSlot("12:30"),
        new TimeSlot("13:00"),
        new TimeSlot("13:30"),
        new TimeSlot("14:00"),
        new TimeSlot("14:30")
      ]);
    });

    it("should return empty array for Saturday (day 6)", async () => {
      const testDate = new Date("2023-10-14"); // Saturday (day 6)
      const result = await service.getAvailableOperatingHoursForDate(
        testDate,
        mockReservationService,
        60
      );

      expect(result).toEqual([]);
    });
  });
});