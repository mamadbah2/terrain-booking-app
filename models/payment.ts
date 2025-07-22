import { ObjectId } from "mongodb";

export interface Payment {
    _id?: ObjectId;
    reservationId: ObjectId | null;
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionId: string;
    status: "pending" | "completed" | "failed" | "refunded";
    paymentDate: string;
}
