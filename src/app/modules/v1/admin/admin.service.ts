import { Driver } from "../driver/driver.model";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { UserRole } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

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
            $cond: [{ $eq: ["$status", RideStatus.COMPLETED] }, "$fare", 0],
          },
        },
        revenueLostFromCancelledRides: {
          $sum: {
            $cond: [{ $eq: ["$status", RideStatus.CANCELLED] }, "$fare", 0],
          },
        },

        uniqueRiders: {
          $addToSet: "$riderId",
        },
        uniqueDrivers: {
          $addToSet: "$driverId",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalRides: 1,
        newRidesInLast7Days: 1,
        newRidesInLast30Days: 1,
        completedRides: 1,
        cancelledRides: 1,
        inProgressRides: 1,
        acceptedRides: 1,
        requestedRides: 1,
        revenueFromCompletedRides: 1,
        revenueLostFromCancelledRides: 1,
        uniqueRidersCount: { $size: "$uniqueRiders" },
        uniqueDriversCount: { $size: "$uniqueDrivers" },
      },
    },
  ]);

  return ridesStats[0];
};

export const AdminService = {
  getUsersStats,
  getDriversStats,
  getRidesStats,
};
