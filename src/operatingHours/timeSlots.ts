export class TimeSlot {
  public time: string;

  constructor(timeStr: string) {
    const timeFormat = /^\d{2}:\d{2}$/;
    if (!timeFormat.test(timeStr)) {
      throw new Error("Invalid time format. Expected HH:mm");
    }
    this.time = timeStr;
  }

  static fromString(timeStr: string): TimeSlot {
    return new TimeSlot(timeStr);
  }
}
