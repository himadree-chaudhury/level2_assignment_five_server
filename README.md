# Ride Booking API <sup><small><sub>`v1.0.0`</sub></small></sup>

![Static Badge](https://img.shields.io/badge/v22.15.0-version?style=flat&logo=nodedotjs&logoColor=%2341AD48&logoSize=auto&label=Node.js&labelColor=white&color=%2376D04B)
![Static Badge](https://img.shields.io/badge/v5.8.3-package?style=flat&logo=typescript&logoColor=white&logoSize=auto&label=TypeScript&labelColor=blue&color=gray)
![Static Badge](https://img.shields.io/badge/v5.1.0-package?style=flat&logo=express&logoColor=black&logoSize=auto&label=express&labelColor=white&color=%23000000)
![Static Badge](https://img.shields.io/badge/v8.17.0-package?style=flat&logo=mongoose&logoColor=%23800000&logoSize=auto&label=mongoose&labelColor=%23c7c6c3&color=%23800000)
![Static Badge](https://img.shields.io/badge/v9.0.2-package?style=flat&logo=jsonwebtokens&logoColor=%23F80046&logoSize=auto&label=Json%20Web%20Token&labelColor=black&color=white)
![Static Badge](https://img.shields.io/badge/v9.0.2-package?style=flat&logo=redis&logoColor=red&logoSize=auto&label=Redis&labelColor=%23091a23&color=%23dcff1e)

## Overview

The **Ride Booking API** is a secure, scalable, and role-based RESTful API built for a ride-sharing platform using **Express.js** and **Mongoose**. It facilitates seamless management of users, drivers, rides, authentication, and statistical insights. The API supports essential functionalities such as user registration, driver onboarding, ride requests, and detailed analytics, forming the backbone of a robust ride-sharing application. It uses **JSON** for data exchange, leverages standard HTTP methods (GET, POST, PATCH), and is organized into modular routes for clarity and maintainability.

This project is developed with a focus on security (using JWT and bcrypt), scalability (with MongoDB and Redis), and type safety (via TypeScript and Zod). Future enhancements include social login, email notifications, real-time ride tracking, payment integration, and multi-language support to enhance user experience and accessibility.

[![Live Link](https://img.shields.io/badge/Live%20Link-link?style=for-the-badge&logo=vercel&logoColor=white&logoSize=auto&label=vercel&labelColor=black&color=white)](https://ride-booking-backend-himadree.vercel.app/)

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

| Package          | Purpose                       | Reason                                                                                      |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| **Express.js**   | Web framework                 | Provides a robust and flexible framework for building RESTful APIs with middleware support. |
| **Mongoose**     | MongoDB ORM                   | Simplifies MongoDB interactions with schema-based modeling and validation.                  |
| **TypeScript**   | Type-safe JavaScript          | Ensures type safety, reduces runtime errors, and improves code maintainability.             |
| **jsonwebtoken** | JWT authentication            | Enables secure, stateless authentication for role-based access control.                     |
| **bcryptjs**     | Password hashing              | Secures user passwords with strong hashing algorithms.                                      |
| **Zod**          | Schema validation             | Validates incoming request data to ensure data integrity and security.                      |
| **Redis**        | Session storage               | Provides fast, in-memory storage for session management and caching.                        |
| **passport**     | Authentication middleware     | Simplifies authentication strategies, including potential future social login integrations. |
| **cors**         | Cross-Origin Resource Sharing | Enables secure API access from front-end applications.                                      |
| **morgan**       | HTTP request logging          | Logs requests for debugging and monitoring API usage.                                       |
| **envalid**      | Environment validation        | Ensures environment variables are correctly configured and validated.                       |
| **eslint**       | Code linting                  | Enforces coding standards and improves code quality.                                        |
| **ts-node-dev**  | Development server            | Enables fast development with automatic TypeScript compilation and server restarts.         |

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
   git clone https://github.com/himadree-chaudhury/ride-booking-api.git
   cd ride-booking-api
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following:

   ```env
   PORT=300
   NODE_ENV=development
   DB_URL=mongodb://localhost:27017/ride_booking
   EXPRESS_SESSION_SECRET=your_secret_key
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_ACCESS_TOKEN_EXPIRATION=1h
   JWT_REFRESH_TOKEN_EXPIRATION=7d
   BCRYPT_SALT_ROUNDS=10
   REDIS_USERNAME=default
   REDIS_PASSWORD=your_redis_password
   REDIS_HOST=your_redis_host
   REDIS_PORT=11346
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

- **PORT**: Port number for the server (default: 3000).
- **NODE_ENV**: Environment mode (development or production).
- **DB_URL**: MongoDB connection string.
- **EXPRESS_SESSION_SECRET**: Secret key for session management.
- **JWT_ACCESS_SECRET**: Secret key for JWT access tokens.
- **JWT_REFRESH_SECRET**: Secret key for JWT refresh tokens.
- **JWT_ACCESS_TOKEN_EXPIRATION**: Expiration time for access tokens (default: 1 hour).
- **JWT_REFRESH_TOKEN_EXPIRATION**: Expiration time for refresh tokens (default: 7 days).
- **BCRYPT_SALT_ROUNDS**: Number of rounds for bcrypt password hashing (default: 10).
- **REDIS_USERNAME**: Username for Redis (default: default).
- **REDIS_PASSWORD**: Password for Redis.
- **REDIS_HOST**: Hostname for Redis
- **REDIS_PORT**: Port number for Redis (default: 11346).

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

1. Create a issue for your feature or bug.
2. Fork the repository.
3. Create a feature branch (`git checkout -b feature/your-feature`).
4. Commit changes (`git commit -m 'Add your feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

## Read Followings For Better Understanding

- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [License](LICENSE.md)

## Author

![Static Badge](https://img.shields.io/badge/Himadree%20Chaudhury-author?style=social&label=%F0%9F%A7%91%E2%80%8D%F0%9F%92%BB&color=black)
