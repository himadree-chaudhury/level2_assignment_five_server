# Contributing Guidelines

Thank you for your interest in contributing to the Ride Booking API project! This is a secure, scalable, role-based backend API for a ride-sharing platform built with Express.js, Mongoose, and TypeScript. Contributions are welcome to improve features, fix bugs, enhance documentation, or add new functionalities like real-time tracking or payment integration. Whether you're fixing a typo or adding a major feature, your help is appreciated.

Please follow these guidelines to ensure a smooth collaboration process. This project adheres to a code of conduct (if one exists, or consider adding a CODE_OF_CONDUCT.md based on the Contributor Covenant).

## Getting Started

### Prerequisites
- Node.js (v20.17.0 or higher)
- npm or yarn for package management
- MongoDB (local or cloud instance like MongoDB Atlas)
- Redis (local or cloud instance)
- Git for version control
- Familiarity with TypeScript, Express.js, Mongoose, JWT, and Zod is helpful

### Setting Up Your Development Environment
1. Fork the repository on GitHub.
2. Clone your forked repository:
   ```
   git clone https://github.com/YOUR_USERNAME/level2_assignment_five_server.git
   cd level2_assignment_five_server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory based on the example in the README.md. Ensure you have valid MongoDB and Redis connections.
5. Run the development server:
   ```
   npm run dev
   ```
   This uses `ts-node-dev` for hot-reloading.
6. Verify the setup by accessing the API endpoints (e.g., via Postman or curl) as described in the README.md.

## How to Contribute

### Reporting Issues
- Check if the issue already exists in the [Issues](https://github.com/himadree-chaudhury/level2_assignment_five_server/issues) tab.
- If not, create a new issue with a clear title, description, steps to reproduce (for bugs), and any relevant screenshots or logs.
- Use labels like `bug`, `enhancement`, `documentation`, or `help wanted` to categorize.

### Submitting Changes
1. Create a new branch from `main` for your changes:
   ```
   git checkout -b feature/your-feature-name  # or bugfix/your-bugfix-name
   ```
   Use descriptive branch names (e.g., `feature/add-payment-integration`).
2. Make your changes in the codebase. Follow the code style and best practices below.
3. Commit your changes with clear, concise messages. We recommend using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for consistency:
   - Examples:
     - `feat: add ride cancellation endpoint`
     - `fix: resolve JWT token expiration issue`
     - `docs: update README with new setup instructions`
     - `refactor: improve error handling in user controller`
4. Run linting and fix any issues:
   ```
   npm run lint:fix
   ```
5. If applicable, add or update tests (see Testing section below).
6. Push your branch to your fork:
   ```
   git push origin feature/your-feature-name
   ```
7. Open a Pull Request (PR) from your fork to the original repository's `main` branch.
   - Provide a detailed description of your changes, referencing any related issues (e.g., "Closes #123").
   - Include screenshots or before/after examples if relevant.
   - Ensure your PR passes any automated checks (e.g., linting).

PRs will be reviewed as soon as possible. Maintainers may request changes—please respond promptly.

## Code Style and Best Practices
- **Linting**: Adhere to ESLint rules defined in `.eslintrc`. Run `npm run lint` before committing.
- **TypeScript**: Use strict typing. Avoid `any` types where possible.
- **Folder Structure**: Follow the existing modular structure:
  - `src/routes/`: For Express routes.
  - `src/controllers/`: For business logic.
  - `src/models/`: For Mongoose schemas.
  - `src/middlewares/`: For authentication, validation, etc.
  - `src/services/`: For reusable utilities (e.g., JWT handling).
- **Validation**: Use Zod for schema validation in requests.
- **Security**: Hash passwords with bcrypt, use JWT for auth, and avoid exposing sensitive data.
- **Error Handling**: Use standardized error responses with HTTP status codes.
- **Logging**: Utilize Morgan for request logging.
- **Performance**: Optimize Mongoose queries and use Redis for caching where appropriate.
- **Documentation**: Update the README.md or add inline comments for new features.

## Testing
Currently, the project does not have automated tests, but contributions to add them are highly encouraged (e.g., using Jest or Mocha for unit/integration tests).
- Test new features or bug fixes manually via API tools like Postman.
- Aim for coverage on critical paths like authentication, ride requests, and stats endpoints.
- If adding tests, place them in a `tests/` folder and update `package.json` scripts accordingly (e.g., `npm run test`).

## Community and Communication
- Join discussions in issues or PRs.
- For major changes (e.g., architecture overhauls), open an issue first to discuss.
- Be respectful and constructive in feedback.

## License
By contributing, you agree that your contributions will be licensed under the project's license (MIT, as per the repository—check LICENSE file).

Thank you for helping make this project better! If you have questions, feel free to open an issue.
