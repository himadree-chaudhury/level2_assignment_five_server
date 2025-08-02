import mongoose, { Schema } from "mongoose";
import { IDriver } from "./driver.interface";

const driverSchema = new mongoose.Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    vehicleInfo: {
      model: { type: String, required: true },
      registrationNumber: { type: String, required: true },
      year: { type: Number, required: true },
      maxPassengers: { type: Number, required: true },
    },
    driverLicense: {
      number: { type: String, required: true },
      expirationDate: { type: Date, required: true },
    },
    isAvailable: { type: Boolean },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    currentLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    isApproved: { type: Boolean },
    isSuspended: { type: Boolean },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

driverSchema.pre("save", function (next) {
  if (this.isNew) {
    this.isApproved = false;
    this.isSuspended = false;
  }
  next();
});

export const Driver = mongoose.model<IDriver>("Driver", driverSchema);
