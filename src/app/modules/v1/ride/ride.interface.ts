import { Types } from "mongoose";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  CANCELLED = "CANCELLED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
}

export interface IRide {
  _id?: string;
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickupLocation: {
    latitude: number;
    longitude: number;
  };
  destinationLocation: {
    latitude: number;
    longitude: number;
  };
  status: RideStatus;
  fare: number;
  requestedAt?: Date;
  cancelledBy?: Types.ObjectId;
  canceller?: string;
  cancelledAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  transitAt?: Date;
  completedAt?: Date;
}
