import { ObjectId } from "mongodb";

export interface Reservation {
    _id?: ObjectId;
    fieldId: ObjectId | null;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    totalPrice: number;
    status: "pending" | "confirmed" | "paid" | "completed" | "cancelled";
    reservationCode: string;
    guestName: string;
    guestPhoneNumber: string;
    guestEmail: string | null;
    bookedAt: string;
    paymentId: ObjectId | null;
  }