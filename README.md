# Referral & Credit System

A comprehensive referral and credit system backend built with Express.js and TypeScript following Clean Architecture principles.

## Project Structure

This project follows a Clean Architecture pattern with clear separation of concerns:

- **Domain Layer**: Core business entities and models
- **Application Layer**: Use cases, services, and interfaces
- **Infrastructure Layer**: External concerns like database, security, and utilities
- **Presentation Layer**: HTTP controllers, routes, and middlewares

## Features

- User authentication and authorization
- Referral system with tracking
- Credit management
- Purchase tracking
- JWT-based security
- MongoDB integration
- TypeScript support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

5. Start the development server:
   ```bash
   npm run dev
   ```

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Folder Structure

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for complete folder structure documentation.

## License

ISC
