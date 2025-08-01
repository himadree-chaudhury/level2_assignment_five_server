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
  const driver = await Driver.create(payload);
  return driver;
};

const getDriverById = async (userId: string, driverId: string) => {
  const driver = await Driver.findById(driverId);

  if (!driver) {
    const error = CustomError.notFound({
      message: "Driver not found",
      errors: ["The driver with the provided ID does not exist."],
      hints: "Please check the driver ID and try again.",
    });
    throw error;
  }
  if (driver.userId.toString() !== userId) {
    const error = CustomError.forbidden({
      message: "Forbidden",
      errors: ["You do not have permission to access this driver."],
      hints: "Please check your permissions and try again.",
    });
    throw error;
  }
  return driver;
};

const getAllDrivers = async () => {
  const drivers = await Driver.find().populate("userId", "name").lean();
  return drivers;
};

const approveDriver = async (driverId: string) => {
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { isApproved: true },
    { new: true }
  );

  if (!driver) {
    const error = CustomError.notFound({
      message: "Driver not found",
      errors: ["The driver with the provided ID does not exist."],
      hints: "Please check the driver ID and try again.",
    });
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    driver.userId,
    { role: UserRole.DRIVER },
    { new: true }
  );
  if (!user) {
    const error = CustomError.notFound({
      message: "User not found",
      errors: ["The user associated with the driver does not exist."],
      hints: "Please check the user ID and try again.",
    });
    throw error;
  }
  return driver;
};

const toggleAvailability = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
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
  const driver = await Driver.findById(driverId);
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
  approveDriver,
  toggleAvailability,
  updateLocation,
};
