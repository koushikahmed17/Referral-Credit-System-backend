# Folder Structure Documentation

## Complete Project Structure

```
Referral & Credit System/
├── 📁 src/                                    # Source code directory
│   ├── 📁 domain/                             # Domain Layer (Business Logic)
│   │   ├── 📁 entities/                       # Domain entities and interfaces
│   │   │   ├── 📄 User.ts                     # User entity definition
│   │   │   ├── 📄 Referral.ts                 # Referral entity definition
│   │   │   └── 📄 Credit.ts                   # Credit entity definition
│   │   └── 📁 models/                         # Database models (Mongoose)
│   │       ├── 📄 user.model.ts               # User MongoDB model
│   │       ├── 📄 referral.model.ts           # Referral MongoDB model
│   │       ├── 📄 credit.model.ts             # Credit MongoDB model
│   │       ├── 📄 purchase.model.ts           # Purchase MongoDB model
│   │       └── 📄 index.ts                    # Models export barrel
│   │
│   ├── 📁 app/                                # Application Layer (Use Cases & Services)
│   │   ├── 📁 interfaces/                     # Data Transfer Objects (DTOs)
│   │   │   ├── 📄 auth.interface.ts           # Authentication interfaces
│   │   │   ├── 📄 referral.interface.ts       # Referral system interfaces
│   │   │   └── 📄 purchase.interface.ts       # Purchase system interfaces
│   │   ├── 📁 services/                       # Business logic services
│   │   │   ├── 📄 auth.service.ts             # Authentication service
│   │   │   ├── 📄 referral.service.ts         # Referral service
│   │   │   └── 📄 purchase.service.ts         # Purchase service
│   │   └── 📁 use-cases/                      # Application use cases
│   │       ├── 📁 auth/                       # Authentication use cases
│   │       │   ├── 📄 registerUser.usecase.ts # User registration use case
│   │       │   ├── 📄 loginUser.usecase.ts    # User login use case
│   │       │   ├── 📄 verifyToken.usecase.ts  # Token verification use case
│   │       │   └── 📄 refreshToken.usecase.ts # Token refresh use case
│   │       ├── 📁 referral/                   # Referral use cases
│   │       │   ├── 📄 createReferral.usecase.ts      # Create referral use case
│   │       │   ├── 📄 getReferralStats.usecase.ts    # Get referral stats use case
│   │       │   ├── 📄 applyReferral.usecase.ts       # Apply referral use case
│   │       │   ├── 📄 getUserReferrals.usecase.ts    # Get user referrals use case
│   │       │   └── 📄 validateReferralCode.usecase.ts # Validate referral use case
│   │       └── 📁 purchase/                   # Purchase use cases
│   │           ├── 📄 createPurchase.usecase.ts      # Create purchase use case
│   │           ├── 📄 getPurchaseStats.usecase.ts    # Get purchase stats use case
│   │           ├── 📄 getUserPurchases.usecase.ts    # Get user purchases use case
│   │           └── 📄 getPurchaseById.usecase.ts     # Get purchase by ID use case
│   │
│   ├── 📁 infrastructure/                     # Infrastructure Layer (External Concerns)
│   │   ├── 📁 config/                         # Configuration files
│   │   │   ├── 📄 env.ts                      # Environment variables
│   │   │   └── 📄 database.ts                 # Database connection
│   │   ├── 📁 security/                       # Security utilities
│   │   │   ├── 📄 hash.ts                     # Password hashing
│   │   │   ├── 📄 jwt.ts                      # JWT token management
│   │   │   └── 📄 password.ts                 # Password validation
│   │   └── 📁 utils/                          # Utility functions
│   │       ├── 📄 logger.ts                   # Logging utility
│   │       └── 📄 validation.ts               # Input validation schemas
│   │
│   └── 📁 presentation/                       # Presentation Layer (HTTP/API)
│       ├── 📁 controllers/                    # HTTP controllers
│       │   ├── 📄 auth.controller.ts          # Authentication controller
│       │   ├── 📄 referral.controller.ts      # Referral controller
│       │   └── 📄 purchase.controller.ts      # Purchase controller
│       ├── 📁 routes/                         # Express routes
│       │   ├── 📄 auth.routes.ts              # Authentication routes
│       │   ├── 📄 referral.routes.ts          # Referral routes
│       │   └── 📄 purchase.routes.ts          # Purchase routes
│       └── 📁 middlewares/                    # Express middlewares
│           └── 📄 auth.middleware.ts          # Authentication middleware
│
├── 📄 src/index.ts                            # Application entry point
├── 📄 src/server.ts                           # Express server configuration
├── 📄 package.json                            # Project dependencies & scripts
├── 📄 tsconfig.json                           # TypeScript configuration
├── 📄 .env.example                            # Environment variables template
├── 📄 .gitignore                              # Git ignore rules
├── 📄 README.md                               # Project documentation
├── 📄 ARCHITECTURE.md                         # Architecture documentation
└── 📄 FOLDER_STRUCTURE.md                     # This file
```

## Layer Descriptions

### Domain Layer (`src/domain/`)

Contains the core business logic and entities. This layer is independent of external frameworks and databases.

### Application Layer (`src/app/`)

Implements the application-specific business rules and use cases. It orchestrates the domain entities and defines the application's workflow.

### Infrastructure Layer (`src/infrastructure/`)

Handles all external concerns like database connections, security implementations, and utility functions.

### Presentation Layer (`src/presentation/`)

Manages HTTP requests and responses, routing, and middleware for the Express.js application.

## File Naming Conventions

- **Entities**: PascalCase (e.g., `User.ts`, `Referral.ts`)
- **Models**: camelCase with `.model.ts` suffix (e.g., `user.model.ts`)
- **Services**: camelCase with `.service.ts` suffix (e.g., `auth.service.ts`)
- **Use Cases**: camelCase with `.usecase.ts` suffix (e.g., `registerUser.usecase.ts`)
- **Controllers**: camelCase with `.controller.ts` suffix (e.g., `auth.controller.ts`)
- **Routes**: camelCase with `.routes.ts` suffix (e.g., `auth.routes.ts`)
- **Interfaces**: camelCase with `.interface.ts` suffix (e.g., `auth.interface.ts`)
- **Utilities**: camelCase with descriptive names (e.g., `logger.ts`, `validation.ts`)
