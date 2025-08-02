# Ride Booking API

![Node.js](https://img.shields.io/badge/Node.js-v20.17.0-green)
![Express.js](https://img.shields.io/badge/Express.js-v5.1.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v8.17.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.8.3-blue)
![License](https://img.shields.io/badge/License-ISC-blue)

## Overview

The **Ride Booking API** is a secure, scalable, and role-based RESTful API built for a ride-sharing platform using **Express.js** and **Mongoose**. It facilitates seamless management of users, drivers, rides, authentication, and statistical insights. The API supports essential functionalities such as user registration, driver onboarding, ride requests, and detailed analytics, forming the backbone of a robust ride-sharing application. It uses **JSON** for data exchange, leverages standard HTTP methods (GET, POST, PATCH), and is organized into modular routes for clarity and maintainability.

This project is developed with a focus on security (using JWT and bcrypt), scalability (with MongoDB and Redis), and type safety (via TypeScript and Zod). Future enhancements include social login, email notifications, real-time ride tracking, payment integration, and multi-language support to enhance user experience and accessibility.

## Features

- **User Management**: Register, update, verify, block, unblock, and delete user accounts with role-based access control.
- **Driver Management**: Onboard, update, block, unblock, and delete drivers with vehicle details.
- **Ride Operations**: Request, accept, cancel, pick up, and complete rides with location-based data (latitude/longitude).
- **Authentication**: Secure login, logout, and token refresh for users, drivers, and admins using JWT and session management.
- **Statistics**: Comprehensive analytics for users, drivers, and rides, including personal and aggregated stats.
- **Security**: Password hashing with bcrypt, input validation with Zod, and secure session management with Redis.
- **Type Safety**: TypeScript for static typing and improved developer experience.
- **Error Handling**: Standardized HTTP status codes and consistent error responses.
- **Logging**: Request logging with Morgan for debugging and monitoring.

## Technologies Used and Rationale

| Package | Purpose | Reason |
|---------|---------|-------|
| **Express.js** | Web framework | Provides a robust and flexible framework for building RESTful APIs with middleware support. |
| **Mongoose** | MongoDB ORM | Simplifies MongoDB interactions with schema-based modeling and validation. |
| **TypeScript** | Type-safe JavaScript | Ensures type safety, reduces runtime errors, and improves code maintainability. |
| **jsonwebtoken** | JWT authentication | Enables secure, stateless authentication for role-based access control. |
| **bcryptjs** | Password hashing | Secures user passwords with strong hashing algorithms. |
| **Zod** | Schema validation | Validates incoming request data to ensure data integrity and security. |
| **Redis** | Session storage | Provides fast, in-memory storage for session management and caching. |
| **passport** | Authentication middleware | Simplifies authentication strategies, including potential future social login integrations. |
| **cors** | Cross-Origin Resource Sharing | Enables secure API access from front-end applications. |
| **morgan** | HTTP request logging | Logs requests for debugging and monitoring API usage. |
| **envalid** | Environment validation | Ensures environment variables are correctly configured and validated. |
| **eslint** | Code linting | Enforces coding standards and improves code quality. |
| **ts-node-dev** | Development server | Enables fast development with automatic TypeScript compilation and server restarts. |

## API Endpoint Summary

### User Routes
- `POST /user/register`: Register a new user (`name`, `email`, `password`).
- `PATCH /user/update`: Update user details (`name`, `phone`, `picture`).
- `GET /user/verify-request`: Request a verification code.
- `POST /user/verify`: Verify user with a code.
- `GET /user`: List all users (admin only).
- `GET /user/me`: Get authenticated user details.
- `PATCH /user/block/:userId`: Block a user (admin only).
- `PATCH /user/unblock/:userId`: Unblock a user (admin only).
- `PATCH /user/delete/:userId`: Soft delete a user (admin only).

### Auth Routes
- `POST /auth/login`: Login for users, drivers, or admins (`email`, `password`).
- `POST /auth/refresh-token`: Refresh access and refresh tokens.
- `POST /auth/logout`: Logout and invalidate tokens.

### Driver Routes
- `POST /driver/register`: Register a new driver (`name`, `email`, `password`, `vehicleNumber`, `phone`).
- `PATCH /driver/update`: Update driver details (`name`, `phone`, `picture`, `vehicleNumber`).
- `GET /driver`: List all drivers (admin only).
- `GET /driver/me`: Get authenticated driver details.
- `PATCH /driver/block/:driverId`: Block a driver (admin only).
- `PATCH /driver/unblock/:driverId`: Unblock a driver (admin only).
- `PATCH /driver/delete/:driverId`: Soft delete a driver (admin only).

### Ride Routes
- `POST /ride/request`: Request a ride (`pickupLocation`, `destinationLocation`).
- `PATCH /ride/accept/:rideId`: Accept a ride (driver only).
- `PATCH /ride/cancel/:rideId`: Cancel a ride (rider or driver).
- `PATCH /ride/pickup/:rideId`: Mark ride as picked up (driver only).
- `PATCH /ride/complete/:rideId`: Complete a ride (driver only).
- `GET /ride/:rideId`: Get ride details.

### Stat Routes
- `GET /stat/users`: Get user statistics (admin only).
- `GET /stat/drivers`: Get driver statistics (admin only).
- `GET /stat/rides`: Get ride statistics (admin only).
- `GET /stat/rider-stats`: Get personal rider statistics.
- `GET /stat/driver-stats`: Get personal driver statistics.

## Setup & Environment Instructions

### Prerequisites
- **Node.js**: v20.17.0 or higher
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **Redis**: Local or cloud instance
- **Git**: For cloning the repository

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/himadree-chaudhury/level2_assignment_five_server.git
   cd level2_assignment_five_server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ride_booking
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   SESSION_SECRET=your_session_secret_key
   ```

4. **Run the Application**:
   - Development mode (with hot-reload):
     ```bash
     npm run dev
     ```
   - Build for production:
     ```bash
     npm run build
     npm start
     ```

5. **Linting**:
   - Check code quality:
     ```bash
     npm run lint
     ```
   - Fix linting issues:
     ```bash
     npm run lint:fix
     ```

### Environment Variables
- `PORT`: Port for the Express server (default: 5000).
- `MONGODB_URI`: MongoDB connection string.
- `REDIS_URL`: Redis connection string.
- `JWT_SECRET`: Secret key for JWT access tokens.
- `JWT_REFRESH_SECRET`: Secret key for JWT refresh tokens.
- `SESSION_SECRET`: Secret key for session management.

## Future Enhancements
- Implement **social login** (e.g., Google OAuth via Passport).
- Add **email notifications** for verification and ride updates.
- Enable **real-time ride tracking** using WebSockets.
- Integrate **payment gateways** for seamless transactions.
- Add **ride rating systems** for users and drivers.
- Support **multi-language** API responses.
- Implement **push notifications** and **in-app chat** for better communication.
- Enhance **analytics** with real-time dashboards.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Author
Himadree Chaudhury