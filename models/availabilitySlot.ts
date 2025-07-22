import { ObjectId } from "mongodb";

interface PriceMultiplier {
  startTime: string;
  endTime: string;
  multiplier: number;
}

export interface AvailabilitySlot {
  _id?: ObjectId;
  fieldId: ObjectId | null;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
  priceMultiplier: PriceMultiplier[];
}