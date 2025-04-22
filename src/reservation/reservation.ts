export interface Reservation {
    id: number,
    customerEmail: string,
    customerName: string,
    customerPhone: string,
    startTime: Date,
    endTime: Date,
    status: 'confirmed' | 'pending' | 'cancelled',
    partySize?: number,
    notes?: string,
    createdAt: Date,
    updatedAt: Date
}
