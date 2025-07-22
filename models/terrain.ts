import { ObjectId } from "mongodb";

export interface Terrain {
    _id?: ObjectId;
    name: string;
    location: string;
    pricePerHour: number;
    description: string;
    sport: string;
    amenities: Amenity[];
    capacity: string;
    surface: string;
    dimensions: string;
    images: string[];
    ownerId: ObjectId | null;
    managerId: ObjectId | null; // Assigned manager for the terrain
    isActive: boolean;
}

export interface Amenity {
    icon: string;
    name: string;
}