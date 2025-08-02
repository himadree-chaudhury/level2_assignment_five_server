import z from "zod";

export const rideValidationSchema = z.object({
  pickupLocation: z.object({
    latitude: z
      .number("Please enter a valid latitude")
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z
      .number("Please enter a valid longitude")
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
  }),
  destinationLocation: z.object({
    latitude: z
      .number("Please enter a valid latitude")
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    longitude: z
      .number("Please enter a valid longitude")
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
  }),
});

