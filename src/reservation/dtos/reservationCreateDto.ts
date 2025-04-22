export interface ReservationCreateDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  startTime: Date;
  endTime: Date;
  status?: string;
}