import z from "zod";

export const driverValidationSchema = z.object({
  userId: z
    .string("Please provide a valid user ID")
    .min(1, "User ID cannot be empty"),
  vehicleInfo: z.object({
    model: z
      .string("Please enter the vehicle model")
      .min(1, "Vehicle model cannot be empty"),
    registrationNumber: z
      .string("Please enter the vehicle registration number")
      .min(1, "Vehicle registration number cannot be empty"),
    year: z
      .number("Please enter a valid year")
      .int("Year must be an integer")
      .min(2001, "Year must be 2001 or later"),
    maxPassengers: z
      .number("Please enter the maximum number of passengers")
      .int("Max passengers must be an integer")
      .min(1, "Max passengers must be at least 1"),
  }),
  driverLicense: z.object({
    number: z
      .string("Please enter the driver license number")
      .min(1, "Driver license number cannot be empty"),
    expirationDate: z.string().refine((date)=> !isNaN(Date.parse(date)), {
      message: "Please enter a valid expiration date",
    }),
    }),
  isAvailable: z.boolean("Please specify if the driver is available"),
  currentLocation: z.object({
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


export const updateLocationValidationSchema = z.object({
  currentLocation: z.object({
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

// example json for updateLocationValidationSchema
// {
//   "currentLocation": {
//     "latitude": 37.7749,
//     "longitude": -122.4194
//   }
// }