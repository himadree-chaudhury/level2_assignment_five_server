import mongoose, { Schema } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const rideSchema = new mongoose.Schema<IRide>(
  {
    riderId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
    pickupLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    destinationLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: Object.values(RideStatus),
    },
    fare: { type: Number },
    requestedAt: { type: Date },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancelledAt: { type: Date },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

rideSchema.pre("save", function (next) {
  if (this.isNew) {
    this.status = RideStatus.REQUESTED;
    this.requestedAt = new Date();
  }
  next();
});

export const Ride = mongoose.model<IRide>("Ride", rideSchema);