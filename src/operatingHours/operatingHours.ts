export interface OperatingHours {
  id: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface OperatingHoursCreateDto {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed?: boolean;
}