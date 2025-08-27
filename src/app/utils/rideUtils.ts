import { IDriver } from "../modules/v1/driver/driver.interface";
import { Driver } from "../modules/v1/driver/driver.model";

// Haversine Formula to Calculate Distance
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

// Find Nearest Driver
export const findNearestDriver = async (pickupLocation: {
  latitude: number;
  longitude: number;
}) => {
  const allAvailableDrivers: IDriver[] = await Driver.find({
    isApproved: true,
    isSuspended: false,
    isAvailable: true,
  }).populate("userId", "name phone");

  let nearestDriver = null;
  let shortestDistance = Infinity;

  for (const driver of allAvailableDrivers) {
    // Ensure driver's location is available
    if (
      typeof driver?.currentLocation?.latitude !== "number" ||
      typeof driver?.currentLocation?.longitude !== "number"
    ) {
      continue;
    }

    const dist = haversineDistance(
      pickupLocation.latitude,
      pickupLocation.longitude,
      driver.currentLocation.latitude,
      driver.currentLocation.longitude
    );

    if (dist < shortestDistance) {
      shortestDistance = dist;
      nearestDriver = driver;
    }
  }

  // Optional: Set a maximum radius
  if (shortestDistance > 10) return null; // no driver within 5 km

  return { nearestDriver, distanceFromPickup: shortestDistance };
};

export const calculateFare = (distanceInKm: number): number => {
  const baseFare = 50; // e.g., BDT 50
  const perKmRate = 20; // e.g., BDT 20/km

  return parseFloat((baseFare + distanceInKm * perKmRate).toFixed(2));
};
