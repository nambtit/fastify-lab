# Fastify Auth API

A modular Fastify authentication API built with TypeScript, using best practices such as a layered architecture (models, repositories, services, routes) and dependency injection. This project uses in-memory data storage (via repository interfaces) but is designed to allow an easy swap to a persistent datastore in the future.

## Libraries and Dependencies
### Common dependencies
- Node.js version 24 or later
- Yarn for package management

### Runtime dependencies
- fastify: Fast and low-overhead web framework
- bcrypt: Secure password hashing
- dotenv: Loads environment variables from a .env file
- jose: Javascript Object Signing and Encryption for JWT creation and verification

### Development dependencies
- typescript: TypeScript for type safety
- ts-node: Run TypeScript without manual compilation
- eslint: Linting tool
- prettier: Code formatter

## Installation

1. Clone the repository
2. Install dependencies:
```
yarn install
or
npm install
```

3. Create a `.env` file at the project root by referencing the [.env.example](.env.example) file, updating the configuration to match with the target environment.

## How to run
#### in development mode
```bash
yarn dev
```
#### to build the code for distribution purpose
```bash
yarn build
```
the release code is under `./dist` folder. The released code can run in production mode with the following command:
```bash
node dist/server.js
```

### API specification document
After the service starts successfully, non-production environments (`SERVICE_ENV` is not configured as `production`) will expose API documentation at http://localhost:3000/docs#/. The corresponding postman collection can be found [here](/docs/Auth%20Service.postman_collection.json)

## Features

- User Registration: Create new users with securely hashed and salted passwords.
- Authentication: Login to obtain a JWT access token (valid for 15 minutes) along with a refresh token (valid for 7 days).
- Token Refresh: Endpoint to exchange an expired JWT with a new one using the refresh token.
- Logout: Invalidate JWT and refresh token to end the session.
- Profile Endpoint: Protected endpoint to obtain user profile details.

## Relevant configuration
Please refer to the [.env.example](.env.example) file for all configuration.

## Linting & Formatting

Lint:
  yarn lint

Prettier formatting is configured in .prettierrc.json.

## Future Work

- Database Integration: Replace the in-memory repository implementations with a persistent storage solution (e.g., PostgreSQL or MongoDB).
- Testing: Write unit tests and integration tests for services and routes.
- Performance Optimization: Implement caching and rate limiting.
- CI/CD: Set up continuous integration and deployment pipelines.