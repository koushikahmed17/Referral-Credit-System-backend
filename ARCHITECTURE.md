# Architecture Documentation

## Overview

This project follows Clean Architecture principles to ensure maintainability, testability, and scalability. The architecture is organized into four distinct layers with clear dependencies and responsibilities.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)

The innermost layer containing core business logic and entities.

**Components:**

- **Entities** (`entities/`): Core business objects (User, Referral, Credit)
- **Models** (`models/`): Database models using Mongoose

**Responsibilities:**

- Define business entities and their properties
- Establish business rules and constraints
- Database schema definitions

### 2. Application Layer (`src/app/`)

Contains application-specific business logic and use cases.

**Components:**

- **Interfaces** (`interfaces/`): Data Transfer Objects (DTOs)
- **Services** (`services/`): Business logic services
- **Use Cases** (`use-cases/`): Application-specific business rules

**Responsibilities:**

- Implement use cases and business workflows
- Define interfaces between layers
- Orchestrate domain entities and services

### 3. Infrastructure Layer (`src/infrastructure/`)

Handles external concerns and technical implementation details.

**Components:**

- **Config** (`config/`): Configuration management
- **Security** (`security/`): Authentication and security utilities
- **Utils** (`utils/`): Utility functions and helpers

**Responsibilities:**

- Database connections and configurations
- Security implementations (JWT, hashing)
- External service integrations
- Logging and monitoring

### 4. Presentation Layer (`src/presentation/`)

Handles HTTP requests and responses.

**Components:**

- **Controllers** (`controllers/`): HTTP request handlers
- **Routes** (`routes/`): API endpoint definitions
- **Middlewares** (`middlewares/`): Request processing middleware

**Responsibilities:**

- Handle HTTP requests and responses
- Validate input data
- Transform data between external and internal formats
- Apply cross-cutting concerns (authentication, logging)

## Dependency Flow

The architecture follows the Dependency Inversion Principle:

```
Presentation Layer → Application Layer → Domain Layer
                ↘ Infrastructure Layer ↗
```

- Outer layers depend on inner layers
- Inner layers have no knowledge of outer layers
- Dependencies flow inward only

## Key Principles

1. **Separation of Concerns**: Each layer has distinct responsibilities
2. **Dependency Inversion**: Dependencies point inward
3. **Single Responsibility**: Each module has one reason to change
4. **Open/Closed Principle**: Open for extension, closed for modification
5. **Interface Segregation**: Small, focused interfaces

## Benefits

- **Maintainability**: Clear structure makes code easy to understand and modify
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to add new features without affecting existing code
- **Flexibility**: Can change implementations without affecting business logic
