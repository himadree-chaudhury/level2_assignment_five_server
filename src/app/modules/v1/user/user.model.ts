import mongoose, { Schema } from "mongoose";
import { IUser, UserRole } from "./user.interface";

const authSchema = new Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: {
      type: String,
      enum: Object.values(UserRole),
    },
    isBlocked: { type: Boolean },
    isVerified: { type: Boolean },
    isDeleted: { type: Boolean },
    auths: [authSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.isBlocked = false;
    this.isVerified = false;
    this.isDeleted = false;
    this.role = UserRole.RIDER;
  }
  next();
});

export const User = mongoose.model<IUser>("User", userSchema);
