import mongoose from "mongoose";
import { Driver } from "../driver/driver.model";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { UserRole } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

const getUsersStats = async () => {
  const usersStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        verifiedUsers: { $sum: { $cond: ["$isVerified", 1, 0] } },
        blockedUsers: { $sum: { $cond: ["$isBlocked", 1, 0] } },
        deletedUsers: { $sum: { $cond: ["$isDeleted", 1, 0] } },
        totalRiders: {
          $sum: { $cond: [{ $eq: ["$role", UserRole.RIDER] }, 1, 0] },
        },
        totalDrivers: {
          $sum: { $cond: [{ $eq: ["$role", UserRole.DRIVER] }, 1, 0] },
        },
        newUsersInLast7Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
          },
        },
        newUsersInLast30Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return usersStats[0];
};

const getDriversStats = async () => {
  const driversStats = await Driver.aggregate([
    {
      $group: {
        _id: null,
        totalDrivers: { $sum: 1 },
        approvedDrivers: { $sum: { $cond: ["$isApproved", 1, 0] } },
        availableDrivers: { $sum: { $cond: ["$isAvailable", 1, 0] } },
        suspendedDrivers: { $sum: { $cond: ["$isSuspended", 1, 0] } },
        ratedDrivers: { $sum: { $cond: [{ $gt: ["$rating", 0] }, 1, 0] } },
        newDriversInLast7Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
          },
        },
        newDriversInLast30Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return driversStats[0];
};

const getRidesStats = async () => {
  const ridesStats = await Ride.aggregate([
    {
      $group: {
        _id: null,
        totalRides: { $sum: 1 },
        newRidesInLast7Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
          },
        },
        newRidesInLast30Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
          },
        },
        newRideToday: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$createdAt", startOfToday] },
                  { $lt: ["$createdAt", endOfToday] },
                ],
              },
              1,
              0,
            ],
          },
        },
        uniqueRiders: {
          $addToSet: "$riderId",
        },
        uniqueDrivers: {
          $addToSet: "$driverId",
        },
        completedRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.COMPLETED] }, 1, 0] },
        },
        cancelledRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.CANCELLED] }, 1, 0] },
        },
        inProgressRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.IN_TRANSIT] }, 1, 0] },
        },
        acceptedRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.ACCEPTED] }, 1, 0] },
        },
        requestedRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.REQUESTED] }, 1, 0] },
        },
        revenueFromCompletedRides: {
          $sum: {
            $cond: [
              { $eq: ["$status", RideStatus.COMPLETED] },
              "$fare",
              "$$REMOVE",
            ],
          },
        },
        revenueLostFromCancelledRides: {
          $sum: {
            $cond: [
              { $eq: ["$status", RideStatus.CANCELLED] },
              "$fare",
              "$$REMOVE",
            ],
          },
        },
        averageRevenuePerRide: {
          $avg: {
            $cond: [
              { $eq: ["$status", RideStatus.COMPLETED] },
              "$fare",
              "$$REMOVE",
            ],
          },
        },
      },
    },
    {
      $set: {
        uniqueRiders: { $size: "$uniqueRiders" },
        uniqueDrivers: { $size: "$uniqueDrivers" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return ridesStats[0];
};

const getRiderStats = async (riderId: string) => {
  const riderStats = await Ride.aggregate([
    { $match: { riderId: new mongoose.Types.ObjectId(riderId) } },
    {
      $group: {
        _id: null,
        totalRides: { $sum: 1 },
        rideInLast7Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
          },
        },
        rideInLast30Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
          },
        },
        newRideToday: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$createdAt", startOfToday] },
                  { $lt: ["$createdAt", endOfToday] },
                ],
              },
              1,
              0,
            ],
          },
        },
        uniqueDrivers: {
          $addToSet: "$driverId",
        },
        completedRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.COMPLETED] }, 1, 0] },
        },
        cancelledRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.CANCELLED] }, 1, 0] },
        },
        inProgressRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.IN_TRANSIT] }, 1, 0] },
        },
        totalFare: {
          $sum: {
            $cond: [{ $eq: ["$status", RideStatus.COMPLETED] }, "$fare", 0],
          },
        },
        avgFare: {
          $avg: {
            $cond: [
              { $eq: ["$status", RideStatus.COMPLETED] },
              "$fare",
              "$$REMOVE",
            ],
          },
        },
        myAllRides: {
          $push: {
            status: "$status",
            fare: "$fare",
            pickupLocation: "$pickupLocation",
            destinationLocation: "$destinationLocation",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
        myCompletedRides: {
          $push: {
            $cond: [
              { $eq: ["$status", RideStatus.COMPLETED] },
              {
                status: "$status",
                fare: "$fare",
                pickupLocation: "$pickupLocation",
                destinationLocation: "$destinationLocation",
                requestedAt: "$requestedAt",
                cancelledAt: "$cancelledAt",
                acceptedAt: "$acceptedAt",
                pickedUpAt: "$pickedUpAt",
                completedAt: "$completedAt",
              },
              "$$REMOVE",
            ],
          },
        },
        myCancelledRides: {
          $push: {
            $cond: [
              {
                $eq: ["$cancelledBy", new mongoose.Types.ObjectId(riderId)],
              },
              {
                status: "$status",
                fare: "$fare",
                pickupLocation: "$pickupLocation",
                destinationLocation: "$destinationLocation",
                requestedAt: "$requestedAt",
                cancelledAt: "$cancelledAt",
              },
              "$$REMOVE",
            ],
          },
        },
      },
    },
    {
      $set: {
        myAllRides: {
          $sortArray: {
            input: "$myAllRides",
            sortBy: { fare: -1 },
          },
        },
        uniqueDrivers: { $size: "$uniqueDrivers" },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return riderStats[0];
};

const getDriverStats = async (driverId: string) => {
  const driverStats = await Ride.aggregate([
    { $match: { driverId: new mongoose.Types.ObjectId(driverId) } },
    {
      $group: {
        _id: null,
        totalRides: { $sum: 1 },
        rideInLast7Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
          },
        },
        rideInLast30Days: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
          },
        },
        newRideToday: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ["$createdAt", startOfToday] },
                  { $lt: ["$createdAt", endOfToday] },
                ],
              },
              1,
              0,
            ],
          },
        },
        uniqueRiders: {
          $addToSet: "$riderId",
        },
        completedRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.COMPLETED] }, 1, 0] },
        },
        cancelledRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.CANCELLED] }, 1, 0] },
        },
        inProgressRides: {
          $sum: { $cond: [{ $eq: ["$status", RideStatus.IN_TRANSIT] }, 1, 0] },
        },
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$status", RideStatus.COMPLETED] }, "$fare", 0],
          },
        },
        avgIncome: {
          $avg: {
            $cond: [
              { $eq: ["$status", RideStatus.COMPLETED] },
              "$fare",
              "$$REMOVE",
            ],
          },
        },
        myAllRides: {
          $push: {
            status: "$status",
            fare: "$fare",
            pickupLocation: "$pickupLocation",
            destinationLocation: "$destinationLocation",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
        myCompletedRides: {
          $push: {
            $cond: [
              { $eq: ["$status", RideStatus.COMPLETED] },
              {
                status: "$status",
                fare: "$fare",
                pickupLocation: "$pickupLocation",
                destinationLocation: "$destinationLocation",
                requestedAt: "$requestedAt",
                cancelledAt: "$cancelledAt",
                acceptedAt: "$acceptedAt",
                pickupAt: "$pickupAt",
                completedAt: "$completedAt",
              },
              "$$REMOVE",
            ],
          },
        },
        myCancelledRides: {
          $push: {
            $cond: [
              {
                $eq: ["$cancelledBy", new mongoose.Types.ObjectId(driverId)],
              },
              {
                status: "$status",
                fare: "$fare",
                pickupLocation: "$pickupLocation",
                destinationLocation: "$destinationLocation",
                requestedAt: "$requestedAt",
                cancelledAt: "$cancelledAt",
              },
              "$$REMOVE",
            ],
          },
        },
      },
    },
    {
      $set: {
        myAllRides: {
          $sortArray: {
            input: "$myAllRides",
            sortBy: { fare: -1 },
          },
        },
        uniqueRiders: {
          $sum: { $size: "$uniqueRiders" },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return driverStats[0];
};

export const StatService = {
  getUsersStats,
  getDriversStats,
  getRidesStats,
  getRiderStats,
  getDriverStats,
};
