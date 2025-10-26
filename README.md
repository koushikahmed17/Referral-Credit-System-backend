# 🚀 Referral & Credit System

A comprehensive **Referral & Credit System** backend built with **Express.js**, **TypeScript**, and **MongoDB** following **Clean Architecture** principles. This system enables users to refer others, earn credits on purchases, and manage their referral rewards.

## ✨ Features

### 🔐 **Authentication & Security**

- ✅ **Custom JWT Authentication** with refresh tokens
- ✅ **Secure password hashing** (bcrypt with 12 salt rounds)
- ✅ **Password strength validation** (uppercase, lowercase, numbers, special chars)
- ✅ **Token blacklisting** for secure logout
- ✅ **Protected routes** with middleware

### 🔗 **Referral Management**

- ✅ **Unique referral codes** auto-generated for each user
- ✅ **Referral link sharing** with social media integration
- ✅ **Status tracking** (PENDING → CONFIRMED → CANCELLED)
- ✅ **Self-referral prevention** and duplicate detection
- ✅ **Referral statistics** and analytics

### 💰 **Credit & Purchase System**

- ✅ **First-purchase rewards** (2 credits to both referrer and referred user)
- ✅ **Purchase simulation** without product catalog
- ✅ **Credit transaction history** with source tracking
- ✅ **Double-crediting prevention** with atomic operations
- ✅ **Concurrent user safety** with race condition protection

### 📊 **User Dashboard**

- ✅ **Comprehensive statistics** (total referrals, purchases, credits)
- ✅ **Social sharing buttons** (Twitter, Facebook, WhatsApp, Email)
- ✅ **Credit history** with detailed transaction logs
- ✅ **Data integrity verification** endpoint
- ✅ **Real-time metrics** and insights

### 🛡️ **Enterprise-Grade Robustness**

- ✅ **Multi-layer input validation** (Zod + business logic)
- ✅ **Graceful error handling** with detailed error messages
- ✅ **Comprehensive logging** with structured output
- ✅ **Database connection resilience** with retry logic
- ✅ **Graceful shutdown** handlers

## 🏗️ Architecture & Business Logic

This project follows **Clean Architecture** principles with **4 distinct layers** ensuring maintanability, testability, and scalability.

### 📐 **Clean Architecture Layers**

#### **1. Domain Layer** (`src/domain/`)

**The Core Business Logic - Innermost Layer**

- **Entities** (`entities/`): Core business objects (User, Referral, Credit)
- **Models** (`models/`): Database models using Mongoose

**Responsibilities:**

- ✅ Define business entities and their properties
- ✅ Establish business rules and constraints
- ✅ Database schema definitions with indexes

**Key Files:**

- `User.ts` - User entity with referral code generation
- `Referral.ts` - Referral relationship and status management
- `user.model.ts` - MongoDB schema with unique indexes
- `referral.model.ts` - Referral tracking with compound indexes

#### **2. Application Layer** (`src/app/`)

**Business Workflows & Use Cases**

- **Interfaces** (`interfaces/`): Data Transfer Objects (DTOs)
- **Services** (`services/`): Core business logic services
- **Use Cases** (`use-cases/`): Application-specific business rules
- **Validations** (`validations/`): Zod schemas for input validation

**Responsibilities:**

- ✅ Implement use cases and business workflows
- ✅ Define interfaces between layers
- ✅ Orchestrate domain entities and services
- ✅ Input validation and data transformation

**Key Services:**

- `auth.service.ts` - User registration, login, token management
- `referral.service.ts` - Referral creation, conversion, statistics
- `purchase.service.ts` - Purchase creation with referral reward logic
- `dashboard.service.ts` - Dashboard data aggregation and analytics

#### **3. Infrastructure Layer** (`src/infrastructure/`)

**External Concerns & Technical Implementation**

- **Config** (`config/`): Environment and database configuration
- **Security** (`security/`): JWT, password hashing, validation
- **Utils** (`utils/`): Logging, utilities

**Responsibilities:**

- ✅ Database connections and configurations
- ✅ Security implementations (JWT, bcrypt hashing)
- ✅ External service integrations
- ✅ Logging and monitoring

**Key Components:**

- `jwt.ts` - Token signing, verification, refresh, blacklisting
- `hash.ts` - Password hashing with bcrypt (12 salt rounds)
- `database.ts` - MongoDB connection with retry logic
- `logger.ts` - Structured logging with levels

#### **4. Presentation Layer** (`src/presentation/`)

**HTTP Interface & Request Handling**

- **Controllers** (`controllers/`): HTTP request handlers
- **Routes** (`routes/`): API endpoint definitions
- **Middlewares** (`middlewares/`): Authentication, validation, error handling

**Responsibilities:**

- ✅ Handle HTTP requests and responses
- ✅ Validate input data with Zod schemas
- ✅ Transform data between external and internal formats
- ✅ Apply cross-cutting concerns (auth, logging, CORS)

**Key Components:**

- `auth.middleware.ts` - JWT token validation and user context
- `validate.middleware.ts` - Request validation with detailed error messages
- `error.middleware.ts` - Global error handling and logging

### 🔄 **Dependency Flow**

```
Presentation Layer → Application Layer → Domain Layer
                ↘ Infrastructure Layer ↗
```

**Clean Architecture Principles:**

- ✅ **Dependencies flow inward only** (outer layers depend on inner layers)
- ✅ **Inner layers have no knowledge of outer layers**
- ✅ **Business logic is independent** of frameworks and external concerns
- ✅ **Easy to test** each layer independently

### 🎯 **Business Logic Flow**

#### **User Registration with Referral Code**

```mermaid
graph TD
    A[User Registers] --> B{Referral Code Provided?}
    B -->|Yes| C[Validate Referral Code]
    B -->|No| F[Create User Only]
    C --> D{Valid Code?}
    D -->|Yes| E[Create User + PENDING Referral]
    D -->|No| F[Create User Only - Log Warning]
    E --> G[Update Referred User Record]
    F --> H[Return Success with JWT]
    G --> H
```

#### **First Purchase Referral Reward Flow**

```mermaid
graph TD
    A[User Makes Purchase] --> B{First Purchase?}
    B -->|No| C[Create Purchase Only]
    B -->|Yes| D[Check for PENDING Referral]
    D --> E{PENDING Referral Exists?}
    E -->|No| C
    E -->|Yes| F[Convert Referral to CONFIRMED]
    F --> G[Award 2 Credits to Referrer]
    G --> H[Award 2 Credits to Referred User]
    H --> I[Return Purchase + Reward Info]
    C --> J[Return Purchase Only]
```

#### **Atomic Credit Awarding (Race Condition Safe)**

```mermaid
graph TD
    A[Referral Conversion Triggered] --> B[findOneAndUpdate with Status Check]
    B --> C{Referral Still PENDING?}
    C -->|No| D[Return Error - Already Processed]
    C -->|Yes| E[Atomically Update to CONFIRMED]
    E --> F[Promise.all - Parallel Credit Updates]
    F --> G[$inc Credits for Referrer]
    F --> H[$inc Credits for Referred User]
    G --> I[Log Success]
    H --> I
```

### 🛡️ **Data Integrity & Security**

#### **Double-Crediting Prevention**

- **Database Level**: Unique compound index `(referrerId, referredUserId)`
- **Application Level**: Status checks in `findOneAndUpdate` operations
- **Business Logic**: First-purchase-only validation
- **Atomic Operations**: MongoDB `$inc` operators for credit updates

#### **Race Condition Protection**

- **Atomic Updates**: `findOneAndUpdate` with status conditions
- **Parallel Safe**: Promise.all with independent atomic operations
- **Status Guards**: Only convert PENDING referrals
- **Concurrent Safety**: MongoDB's built-in atomic operation guarantees

#### **Input Validation Layers**

1. **Zod Schema Validation**: Type safety and format validation
2. **Business Logic Validation**: Custom rules (password strength, referral codes)
3. **Database Constraints**: Unique indexes and required fields
4. **Middleware Validation**: Request/response transformation and error handling

### 🔄 **Key Business Rules**

#### **Referral System Rules**

- ✅ Each user gets a **unique 8-character referral code** (auto-generated)
- ✅ Users **cannot refer themselves** (validation check)
- ✅ **One referral relationship per user pair** (unique compound index)
- ✅ Referrals start as **PENDING** and convert to **CONFIRMED** on first purchase
- ✅ **Only first purchase** triggers referral rewards
- ✅ **Both users earn 2 credits** when referral is confirmed

#### **Credit System Rules**

- ✅ Credits are **non-negative integers** (database constraint)
- ✅ Credit updates use **atomic $inc operations** (race condition safe)
- ✅ **First purchase only** triggers referral credits
- ✅ Credits are **earned, not spent** (no spending logic implemented)
- ✅ **Complete audit trail** via credit history endpoint

#### **Purchase System Rules**

- ✅ **Flexible purchase simulation** (no product catalog required)
- ✅ Frontend provides `amount` and `description`
- ✅ **First purchase detection** via count of completed purchases
- ✅ **Automatic referral reward** processing on first purchase
- ✅ **Graceful failure** - purchase succeeds even if referral fails

### 📊 **Database Design**

#### **Collections & Relationships**

```
Users Collection:
├── _id (ObjectId)
├── email (unique index)
├── referralCode (unique index)
├── referredBy (String - referrer's referralCode)
├── credits (Number, default: 0)
└── ... other user fields

Referrals Collection:
├── _id (ObjectId)
├── referrerId (ObjectId -> Users._id)
├── referredUserId (ObjectId -> Users._id)
├── status (PENDING | CONFIRMED | CANCELLED)
├── creditsEarned (Number, default: 0)
└── compound unique index: (referrerId, referredUserId)

Purchases Collection:
├── _id (ObjectId)
├── userId (ObjectId -> Users._id)
├── amount (Number)
├── description (String)
├── status (COMPLETED | PENDING | CANCELLED)
└── ... other purchase fields
```

#### **Key Indexes for Performance**

- `Users.email` (unique) - Fast login lookups
- `Users.referralCode` (unique) - Fast referral code validation
- `Referrals.(referrerId, referredUserId)` (unique compound) - Prevent duplicates
- `Referrals.referrerId + status` - Fast referral stats queries
- `Purchases.userId + status` - Fast first-purchase detection

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. **Clone & Install**

```bash
# Clone the repository
git clone <repository-url>
cd referral-backend

# Install dependencies
npm install
```

### 2. **Environment Setup**

```bash
# Copy environment template
cp .env.example .env

# Edit your environment variables
nano .env
```

**Required Environment Variables:**

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/referral_credit_system

# JWT Security
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=INFO
```

### 3. **Database Setup**

```bash
# Reset database (clears all data)
npm run db:reset

# Seed with test data (optional)
npm run db:seed

# Fresh database (reset + seed)
npm run db:fresh
```

### 4. **Start Development Server**

```bash
# Start with hot reload
npm run dev

# Or start production build
npm run build
npm start
```

**🎉 Server running at:** `http://localhost:3000`

## 📚 API Documentation

### Swagger UI Documentation

The API includes comprehensive **Swagger/OpenAPI documentation** that provides interactive testing and detailed endpoint information.

**Access the documentation:**

- **Swagger UI**: `http://localhost:3000/api-docs`
- **API Base URL**: `http://localhost:3000/api`

### Features of the Swagger Documentation

- 🔍 **Interactive API Testing** - Test endpoints directly from the browser
- 📖 **Complete Endpoint Coverage** - All 20+ endpoints documented
- 🔐 **Authentication Support** - Built-in JWT token testing
- 📝 **Request/Response Examples** - Real-world examples for all endpoints
- 🏷️ **Organized by Tags** - Authentication, Referrals, Purchases, Dashboard, Health
- 📊 **Schema Definitions** - Complete data models and validation rules
- ⚡ **Try It Out** - Execute requests directly from the documentation

### Quick API Testing

1. **Start the server**: `npm run dev`
2. **Open Swagger UI**: Visit `http://localhost:3000/api-docs`
3. **Register a user**: Use the `/api/auth/register` endpoint
4. **Login**: Use the `/api/auth/login` endpoint to get a JWT token
5. **Authorize**: Click "Authorize" button and enter `Bearer <your-jwt-token>`
6. **Test endpoints**: Try any authenticated endpoint directly from the UI

### API Endpoints Overview

| Category           | Endpoints   | Description                                         |
| ------------------ | ----------- | --------------------------------------------------- |
| **Authentication** | 7 endpoints | User registration, login, profile, token management |
| **Referrals**      | 7 endpoints | Referral code generation, validation, statistics    |
| **Purchases**      | 4 endpoints | Purchase creation, history, statistics              |
| **Dashboard**      | 5 endpoints | User dashboard, statistics, credit history          |
| **Health**         | 2 endpoints | System health checks and status                     |

## 📡 API Endpoints

### 🔐 **Authentication** (`/api/auth`)

| Method | Endpoint    | Description           | Auth     |
| ------ | ----------- | --------------------- | -------- |
| `POST` | `/register` | Register new user     | Public   |
| `POST` | `/login`    | Login existing user   | Public   |
| `GET`  | `/profile`  | Get user profile      | Private  |
| `GET`  | `/me`       | Get user info (alias) | Private  |
| `POST` | `/verify`   | Verify JWT token      | Public   |
| `POST` | `/refresh`  | Refresh JWT token     | Public   |
| `POST` | `/logout`   | Logout user           | Private  |
| `GET`  | `/status`   | Check auth status     | Optional |

### 🔗 **Referrals** (`/api/referrals`)

| Method | Endpoint          | Description                   | Auth    |
| ------ | ----------------- | ----------------------------- | ------- |
| `POST` | `/generate`       | Generate custom referral code | Private |
| `POST` | `/apply`          | Apply referral code           | Public  |
| `GET`  | `/stats`          | Get referral statistics       | Private |
| `GET`  | `/list`           | List user's referrals         | Private |
| `GET`  | `/validate/:code` | Validate referral code        | Private |
| `GET`  | `/details/:code`  | Get referral details          | Public  |
| `POST` | `/convert`        | Convert pending referral      | Private |

### 🛒 **Purchases** (`/api/purchases`)

| Method | Endpoint | Description                        | Auth    |
| ------ | -------- | ---------------------------------- | ------- |
| `POST` | `/`      | Create purchase (triggers rewards) | Private |
| `GET`  | `/stats` | Get purchase statistics            | Private |
| `GET`  | `/`      | List user's purchases              | Private |
| `GET`  | `/:id`   | Get purchase by ID                 | Private |

### 📊 **Dashboard** (`/api/dashboard`)

| Method | Endpoint            | Description                  | Auth    |
| ------ | ------------------- | ---------------------------- | ------- |
| `GET`  | `/stats`            | Complete dashboard data      | Private |
| `GET`  | `/summary`          | Dashboard summary (mobile)   | Private |
| `GET`  | `/credit-history`   | Credit transaction history   | Private |
| `GET`  | `/referral-link`    | Referral link + social share | Private |
| `GET`  | `/verify-integrity` | Data integrity audit         | Private |
| `GET`  | `/`                 | Default (returns summary)    | Private |

## 💡 Referral Flow Example

### **Scenario: Lina refers Ryan**

1. **Lina registers** → Gets unique referral code `LINA123`
2. **Lina shares** → `https://yourapp.com/register?ref=LINA123`
3. **Ryan registers** with Lina's code → Referral created (`PENDING`)
4. **Ryan makes first purchase** → Both earn 2 credits, referral becomes `CONFIRMED`
5. **Future purchases** → No additional referral credits

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Build for production
npm start            # Start production server

# Database Management
npm run db:reset     # Clear all database data
npm run db:seed      # Add test users and data
npm run db:fresh     # Reset + seed (full refresh)

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm test             # Run tests (when implemented)
```

## 📚 API Usage Examples

### **Register User with Referral Code**

```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "ryan@example.com",
  "password": "SecurePass123",
  "firstName": "Ryan",
  "lastName": "Johnson",
  "referralCode": "LINA123"
}'
```

### **Create First Purchase (Triggers Referral Reward)**

```bash
curl -X POST http://localhost:3000/api/purchases \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "amount": 99.99,
  "description": "Premium Subscription"
}'
```

### **Get Dashboard Statistics**

```bash
curl -X GET http://localhost:3000/api/dashboard/stats \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Testing with Postman

Import the complete **Postman collection**:

- **File:** `postman/ReferralCreditSystem.postman_collection.json`
- **Features:** 27+ endpoints with auto-saving variables
- **Scenarios:** Complete referral flow (Lina → Ryan)

## 📁 Project Structure

```
src/
├── domain/          # Core business entities & models
├── app/             # Use cases, services & interfaces
├── infrastructure/  # External concerns (DB, security, utils)
└── presentation/    # HTTP layer (controllers, routes, middleware)
```

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for detailed structure.

## 🔒 Security Features

- **Password Security**: bcrypt hashing with 12 salt rounds
- **JWT Tokens**: Stateless authentication with refresh tokens
- **Input Validation**: Multi-layer validation with Zod schemas
- **Race Condition Protection**: Atomic database operations
- **Error Handling**: Graceful error responses without sensitive data exposure
- **CORS Protection**: Configurable cross-origin resource sharing

## 🚀 Deployment

### **Environment Variables for Production**

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=super-long-random-production-secret
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=WARN
```

### **Build & Start**

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md) | [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- **Issues**: Create an issue on GitHub
- **API Testing**: Use the provided Postman collection

---

**Built with ❤️ using TypeScript, Express.js, and MongoDB**
