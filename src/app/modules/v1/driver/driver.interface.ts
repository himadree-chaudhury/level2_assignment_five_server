import { Types } from "mongoose";

export interface IDriver {
    _id?: string;
    userId: Types.ObjectId;
    vehicleInfo: {
        model: string;
        registrationNumber: string;
        year: number;
        maxPassengers: number;
    };
    driverLicense: {
        number: string;
        expirationDate: Date;
    };
    isAvailable: boolean;
    isOnline?: boolean;
    rating?: number;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
    isApproved?: boolean;
    isSuspended?: boolean;
}

export interface IUpdateLocation {
    currentLocation: {
        latitude: number;
        longitude: number;
    };
}