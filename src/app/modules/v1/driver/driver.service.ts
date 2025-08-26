import mongoose from "mongoose";
import { CustomError } from "../../../utils/error";
import { UserRole } from "../user/user.interface";
import { User } from "../user/user.model";
import { IDriver, IUpdateLocation } from "./driver.interface";
import { Driver } from "./driver.model";

const registerDriver = async (payload: Partial<IDriver>) => {
  const user = await User.findById(payload.userId);
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }

  if (user.role !== UserRole.RIDER) {
    const error = CustomError.forbidden({
      message: "Forbidden",
      errors: ["Only riders can register as drivers."],
      hints:
        "Please ensure the user is a rider before registering as a driver.",
    });
    throw error;
  }

  if (!user.isVerified) {
    const error = CustomError.forbidden({
      message: "User not verified",
      errors: ["The user must be verified before registering as a driver."],
      hints:
        "Please verify the user before proceeding with driver registration.",
    });
    throw error;
  }

  const existingDriver = await Driver.findOne({
    userId: payload.userId,
  });
  if (existingDriver) {
    const error = CustomError.conflict({
      message: "Driver already registered",
      errors: ["A driver with this user ID already exists."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
  const driver = await Driver.create(payload);

  return driver;
};

const getDriverById = async (userId: string) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user with the provided ID does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
  const driver = await Driver.findOne({ userId: user._id });

  if (!driver) {
    const error = CustomError.notFound({
      message: "Driver not found",
      errors: ["The driver with the provided ID does not exist."],
      hints: "Please check the driver ID and try again.",
    });
    throw error;
  }
  return driver;
};

const getAllDrivers = async () => {
  const drivers = await Driver.find().populate("userId", "name").lean();
  return drivers;
};

const toggleApproveDriver = async (driverId: string) => {
  const driver = await Driver.findOne({ _id: driverId });

  if (!driver) {
    const error = CustomError.notFound({
      message: "Driver not found",
      errors: ["The driver with the provided ID does not exist."],
      hints: "Please check the driver ID and try again.",
    });
    throw error;
  }

  await User.findByIdAndUpdate(
    driver.userId,
    { role: UserRole.DRIVER },
    { new: true }
  );

  driver.isApproved = !driver.isApproved;
  await driver.save();

  return driver;
};

const toggleSuspendDriver = async (driverId: string) => {
  const driver = await Driver.findById(driverId);

  if (!driver) {
    const error = CustomError.notFound({
      message: "Driver not found",
      errors: ["The driver with the provided ID does not exist."],
      hints: "Please check the driver ID and try again.",
    });
    throw error;
  }

  if (!driver.isSuspended) {
    driver.isSuspended = true;
    driver.isAvailable = false;
    await driver.save();
  } else {
    driver.isSuspended = false;
    await driver.save();
  }

  return driver;
};

const toggleAvailability = async (driverId: string) => {
  const driver = await Driver.findOne({
    userId: new mongoose.Types.ObjectId(driverId),
  });
  if (!driver) {
    const error = CustomError.notFound({
      message: "Driver not found",
      errors: ["The driver with the provided ID does not exist."],
      hints: "Please check the driver ID and try again.",
    });
    throw error;
  }

  driver.isAvailable = !driver.isAvailable;
  await driver.save();

  return driver.isAvailable;
};

const updateLocation = async (driverId: string, location: IUpdateLocation) => {
  const driver = await Driver.findOne({
    userId: new mongoose.Types.ObjectId(driverId),
  });
  if (!driver) {
    const error = CustomError.notFound({
      message: "Driver not found",
      errors: ["The driver with the provided ID does not exist."],
      hints: "Please check the driver ID and try again.",
    });
    throw error;
  }
  driver.currentLocation = location.currentLocation;
  await driver.save();

  return driver.currentLocation;
};

export const DriverService = {
  registerDriver,
  getDriverById,
  getAllDrivers,
  toggleApproveDriver,
  toggleSuspendDriver,
  toggleAvailability,
  updateLocation,
};
