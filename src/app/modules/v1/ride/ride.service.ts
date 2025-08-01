import { CustomError } from "../../../utils/error";
import {
  calculateFare,
  findNearestDriver,
  haversineDistance,
} from "../../../utils/rideUtils";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

const createRide = async (payload: Partial<IRide>) => {
  if (!payload.pickupLocation || !payload.destinationLocation) {
    throw CustomError.badRequest({
      message: "Pickup and destination locations are required",
      errors: [
        "pickupLocation is missing from the request payload.",
        "destinationLocation is missing from the request payload.",
      ],
      hints: "Please provide valid pickup and destination locations.",
    });
  }

  const match = await findNearestDriver(payload.pickupLocation);

  if (!match?.nearestDriver) {
    const error = CustomError.notFound({
      message: "No available drivers found",
      errors: ["There are no drivers available near your pickup location."],
      hints: "Please try again later or choose a different pickup location.",
    });
    throw error;
  }

  const rideDistance = haversineDistance(
    payload.pickupLocation.latitude,
    payload.pickupLocation.longitude,
    payload.destinationLocation.latitude,
    payload.destinationLocation.longitude
  );

  const fare = calculateFare(rideDistance);

  const ridePayload = {
    ...payload,
    driverId: match.nearestDriver._id,
    fare,
  };

  const ride = (
    await (
      await Ride.create(ridePayload)
    ).populate(
      "driverId",
      "-_id -userId -createdAt -updatedAt -isApproved -isSuspended"
    )
  ).populate(
    "riderId",
    "-password -auths -isBlocked -isDeleted -isVerified -role -picture -_id -createdAt -updatedAt -email"
  );
  return ride;
};

const acceptRide = async (driverId: string, rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    const error = CustomError.notFound({
      message: "Ride not found",
      errors: ["The ride with the provided ID does not exist."],
      hints: "Please check the ride ID and try again.",
    });
    throw error;
  }
  if (ride.status !== RideStatus.REQUESTED) {
    const error = CustomError.badRequest({
      message: "Ride already accepted or completed",
      errors: ["The ride cannot be accepted at this stage."],
      hints: "Please check the ride status and try again.",
    });
    throw error;
  }
  if (ride.driverId?.toString() !== driverId) {
    const error = CustomError.forbidden({
      message: "You are not authorized to accept this ride",
      errors: ["The ride does not belong to the driver."],
      hints: "Please check the ride details and try again.",
    });
    throw error;
  }
  ride.status = RideStatus.ACCEPTED;
  ride.acceptedAt = new Date();
  await ride.save();

  return ride;
};

const cancelRide = async (userId: string, userRole: string, rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    const error = CustomError.notFound({
      message: "Ride not found",
      errors: ["The ride with the provided ID does not exist."],
      hints: "Please check the ride ID and try again.",
    });
    throw error;
  }
  if (ride.status !== RideStatus.REQUESTED) {
    const error = CustomError.badRequest({
      message: "Ride cannot be canceled",
      errors: ["The ride is not in a cancellable state."],
      hints: "Only rides in the REQUESTED state can be canceled.",
    });
    throw error;
  }

  if (ride.riderId?.toString() !== userId) {
    if (ride.driverId?.toString() !== userId) {
      const error = CustomError.forbidden({
        message: "You are not authorized to cancel this ride",
        errors: ["The ride does not belong to the driver."],
        hints: "Please check the ride details and try again.",
      });
      throw error;
    } else {
      const error = CustomError.forbidden({
        message: "You are not authorized to cancel this ride",
        errors: ["The ride does not belong to the user."],
        hints: "Please check the ride details and try again.",
      });
      throw error;
    }
  }

  ride.status = RideStatus.CANCELLED;
  ride.cancelledBy =
    ride.riderId?.toString() === userId ? ride.riderId : ride.driverId;
  ride.cancelledAt = new Date();
  await ride.save();

  return ride;
};

const pickupRide = async (driverId: string, rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    const error = CustomError.notFound({
      message: "Ride not found",
      errors: ["The ride with the provided ID does not exist."],
      hints: "Please check the ride ID and try again.",
    });
    throw error;
  }
  if (ride.status !== RideStatus.ACCEPTED) {
    const error = CustomError.badRequest({
      message: "Ride cannot be picked up",
      errors: ["The ride is not in a pickable state."],
      hints: "Only rides in the ACCEPTED state can be picked up.",
    });
    throw error;
  }
  if (ride.driverId?.toString() !== driverId) {
    const error = CustomError.forbidden({
      message: "You are not authorized to accept this ride",
      errors: ["The ride does not belong to the driver."],
      hints: "Please check the ride details and try again.",
    });
    throw error;
  }
  ride.status = RideStatus.PICKED_UP;
  ride.pickedUpAt = new Date();
  await ride.save();

  return ride;
};

const completeRide = async (driverId: string, rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    const error = CustomError.notFound({
      message: "Ride not found",
      errors: ["The ride with the provided ID does not exist."],
      hints: "Please check the ride ID and try again.",
    });
    throw error;
  }
  if (ride.status !== RideStatus.PICKED_UP) {
    const error = CustomError.badRequest({
      message: "Ride cannot be completed",
      errors: ["The ride is not in a completable state."],
      hints: "Only rides in the PICKED_UP state can be completed.",
    });
    throw error;
  }
  if (ride.driverId?.toString() !== driverId) {
    const error = CustomError.forbidden({
      message: "You are not authorized to complete this ride",
      errors: ["The ride does not belong to the driver."],
      hints: "Please check the ride details and try again.",
    });
    throw error;
  }
  ride.status = RideStatus.COMPLETED;
  ride.completedAt = new Date();
  await ride.save();

  return ride;
};

const getRideByHistory = async (userId: string, rideId: string) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    const error = CustomError.notFound({
      message: "Ride not found",
      errors: ["The ride with the provided ID does not exist."],
      hints: "Please check the ride ID and try again.",
    });
    throw error;
  }
  if (ride.riderId?.toString() !== userId) {
    if (ride.driverId?.toString() !== userId) {
      const error = CustomError.forbidden({
        message: "You are not authorized to cancel this ride",
        errors: ["The ride does not belong to the driver."],
        hints: "Please check the ride details and try again.",
      });
      throw error;
    } else {
      const error = CustomError.forbidden({
        message: "You are not authorized to cancel this ride",
        errors: ["The ride does not belong to the user."],
        hints: "Please check the ride details and try again.",
      });
      throw error;
    }
  }
  return ride;
};

export const RideService = {
  createRide,
  acceptRide,
  cancelRide,
  pickupRide,
  completeRide,
  getRideByHistory,
};
