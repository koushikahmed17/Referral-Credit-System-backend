# 🏗️ UML System Architecture & Data Flow

This document contains comprehensive UML diagrams explaining the **Referral & Credit System** architecture, data relationships, and business process flows.

---

## 📐 System Architecture Overview

### 🏛️ Clean Architecture Layers Diagram

```mermaid
graph TB
    subgraph "🌐 Presentation Layer"
        PC[Controllers]
        PR[Routes]
        PM[Middlewares]
    end

    subgraph "⚙️ Application Layer"
        AU[Use Cases]
        AS[Services]
        AI[Interfaces]
        AV[Validations]
    end

    subgraph "🏛️ Infrastructure Layer"
        IC[Config]
        IS[Security]
        IU[Utils]
        ID[Database]
    end

    subgraph "💎 Domain Layer"
        DE[Entities]
        DM[Models]
    end

    PC --> AU
    PR --> PC
    PM --> PC
    AU --> AS
    AS --> AI
    AS --> DM
    AS --> IS
    AU --> AV
    IC --> ID
    IS --> IU

    style PC fill:#e1f5fe
    style AU fill:#f3e5f5
    style IC fill:#fff3e0
    style DE fill:#e8f5e8
```

---

## 🗂️ Domain Model - Class Diagram

### 📊 Core Entities & Relationships

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String email
        +String password
        +String firstName
        +String lastName
        +String referralCode
        +String referredBy
        +Number credits
        +Boolean isActive
        +Date lastLoginAt
        +Date createdAt
        +Date updatedAt
        +generateReferralCode()
        +validatePassword()
    }

    class Referral {
        +ObjectId _id
        +ObjectId referrerId
        +ObjectId referredUserId
        +ReferralStatus status
        +Number creditsEarned
        +Date confirmedAt
        +Date cancelledAt
        +Date createdAt
        +Date updatedAt
        +convertToPending()
        +convertToConfirmed()
    }

    class Purchase {
        +ObjectId _id
        +ObjectId userId
        +Number amount
        +String description
        +String productId
        +Object metadata
        +PurchaseStatus status
        +Date createdAt
        +Date updatedAt
        +isFirstPurchase()
        +triggerReferralReward()
    }

    class Credit {
        +ObjectId _id
        +ObjectId userId
        +Number amount
        +String source
        +String description
        +Date createdAt
        +calculateBalance()
    }

    User ||--o{ Referral : "referrer"
    User ||--o{ Referral : "referred"
    User ||--o{ Purchase : "makes"
    User ||--o{ Credit : "earns"
    Referral ||--o| Credit : "generates"
    Purchase ||--o| Credit : "triggers"

    <<enumeration>> ReferralStatus
    ReferralStatus : PENDING
    ReferralStatus : CONFIRMED
    ReferralStatus : CANCELLED

    <<enumeration>> PurchaseStatus
    PurchaseStatus : PENDING
    PurchaseStatus : COMPLETED
    PurchaseStatus : CANCELLED
```

---

## 🔄 Business Process Flows

### 👤 User Registration with Referral Code Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant RS as ReferralService
    participant UM as UserModel
    participant RM as ReferralModel
    participant JWT as JWTService

    FE->>+AC: POST /api/auth/register
    Note over FE,AC: {email, password, firstName, lastName, referralCode?}

    AC->>+AS: registerUser(userData)
    AS->>AS: validatePasswordStrength()
    AS->>AS: hashPassword()
    AS->>+UM: create new User
    UM-->>-AS: User created with auto-generated referralCode

    alt Referral Code Provided
        AS->>+RS: applyReferralCode(code, userId)
        RS->>RS: validateReferralCode()
        RS->>UM: findOne({referralCode})
        UM-->>RS: Referrer found
        RS->>RS: checkSelfReferral()
        RS->>RM: checkExistingReferral()
        RS->>+RM: create PENDING Referral
        RM-->>-RS: Referral created
        RS->>UM: updateReferredBy(userId)
        RS-->>-AS: Referral applied successfully
    end

    AS->>+JWT: signToken(userId, email)
    JWT-->>-AS: JWT token
    AS-->>-AC: {user, token, expiresIn}
    AC-->>-FE: 201 Created {success: true, data}

    Note over FE,RM: User registered with PENDING referral relationship
```

### 🛒 First Purchase Referral Reward Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant PC as PurchaseController
    participant PS as PurchaseService
    participant PM as PurchaseModel
    participant RS as ReferralService
    participant RM as ReferralModel
    participant UM as UserModel

    FE->>+PC: POST /api/purchases
    Note over FE,PC: {amount, description, productId?, metadata?}

    PC->>+PS: createPurchase(purchaseData)
    PS->>+PM: countDocuments({userId, status: COMPLETED})
    PM-->>-PS: existingPurchases count
    PS->>PS: isFirstPurchase = (count === 0)

    PS->>+PM: create Purchase
    PM-->>-PS: Purchase created

    alt First Purchase
        PS->>+RS: convertReferralByUserId(userId)
        RS->>+RM: findOne({referredUserId, status: PENDING})
        RM-->>-RS: PENDING Referral found

        RS->>+RM: findOneAndUpdate({_id, status: PENDING}, {status: CONFIRMED, creditsEarned: 2})
        Note over RS,RM: Atomic operation prevents double-processing
        RM-->>-RS: Referral converted to CONFIRMED

        par Award Credits Atomically
            RS->>+UM: findByIdAndUpdate(referrerId, {$inc: {credits: 2}})
            UM-->>-RS: Referrer credits updated
        and
            RS->>+UM: findByIdAndUpdate(referredUserId, {$inc: {credits: 2}})
            UM-->>-RS: Referred user credits updated
        end

        RS-->>-PS: Referral converted successfully
        PS->>PS: Add referralReward to response
    end

    PS-->>-PC: Purchase created (+ referral reward if applicable)
    PC-->>-FE: 201 Created {success: true, data}

    Note over FE,UM: Both users earn 2 credits on first purchase
```

### 🔒 Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant AM as AuthMiddleware
    participant JWT as JWTService
    participant UM as UserModel
    participant C as Controller

    FE->>+AM: Request with Authorization: Bearer <token>
    AM->>AM: Extract token from header

    alt Token Missing
        AM-->>FE: 401 Unauthorized
    else Token Present
        AM->>+JWT: verifyToken(token)

        alt Token Invalid/Expired
            JWT-->>-AM: Error
            AM-->>FE: 401 Unauthorized
        else Token Valid
            JWT-->>-AM: Decoded payload {userId, email}
            AM->>+UM: findById(userId)

            alt User Not Found
                UM-->>-AM: null
                AM-->>FE: 401 Unauthorized
            else User Found
                UM-->>-AM: User data
                AM->>AM: Set req.user = userData
                AM->>+C: next() - continue to controller
                C-->>-FE: Protected resource response
            end
        end
    end
```

---

## 🏗️ Component Architecture Diagram

### 📦 Module Dependencies & Interactions

```mermaid
graph TD
    subgraph "Frontend Application"
        FE[React/Next.js Frontend]
    end

    subgraph "🌐 Presentation Layer"
        direction TB
        AR[Auth Routes]
        RR[Referral Routes]
        PR[Purchase Routes]
        DR[Dashboard Routes]

        AC[Auth Controller]
        RC[Referral Controller]
        PC[Purchase Controller]
        DC[Dashboard Controller]

        AM[Auth Middleware]
        VM[Validation Middleware]
        EM[Error Middleware]
    end

    subgraph "⚙️ Application Layer"
        direction TB
        AUC[Auth Use Cases]
        RUC[Referral Use Cases]
        PUC[Purchase Use Cases]
        DUC[Dashboard Use Cases]

        ASV[Auth Service]
        RSV[Referral Service]
        PSV[Purchase Service]
        DSV[Dashboard Service]

        AI[Interfaces/DTOs]
        AV[Zod Validations]
    end

    subgraph "🏛️ Infrastructure Layer"
        direction TB
        JWTD[JWT Service]
        HASH[Hash Service]
        LOG[Logger]
        ENV[Environment Config]
        DB[Database Config]
    end

    subgraph "💎 Domain Layer"
        direction TB
        USER[User Model]
        REF[Referral Model]
        PUR[Purchase Model]
        ENT[Entities]
    end

    subgraph "🗄️ External Systems"
        MONGO[(MongoDB)]
    end

    FE --> AR
    FE --> RR
    FE --> PR
    FE --> DR

    AR --> AC
    RR --> RC
    PR --> PC
    DR --> DC

    AC --> AM
    RC --> AM
    PC --> AM
    DC --> AM

    AC --> VM
    RC --> VM
    PC --> VM
    DC --> VM

    AC --> AUC
    RC --> RUC
    PC --> PUC
    DC --> DUC

    AUC --> ASV
    RUC --> RSV
    PUC --> PSV
    DUC --> DSV

    ASV --> JWTD
    ASV --> HASH
    RSV --> LOG
    PSV --> LOG
    DSV --> LOG

    ASV --> USER
    RSV --> REF
    PSV --> PUR
    DSV --> USER
    DSV --> REF
    DSV --> PUR

    USER --> MONGO
    REF --> MONGO
    PUR --> MONGO

    DB --> MONGO

    style FE fill:#e3f2fd
    style AR fill:#e1f5fe
    style ASV fill:#f3e5f5
    style JWTD fill:#fff3e0
    style USER fill:#e8f5e8
    style MONGO fill:#ffebee
```

---

## 🗄️ Database Schema & Relationships

### 📊 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string email UK "Unique email address"
        string password "Hashed password"
        string firstName "User first name"
        string lastName "User last name"
        string referralCode UK "Unique 8-char code"
        string referredBy "Referrer's referralCode"
        number credits "Default 0"
        boolean isActive "Default true"
        date lastLoginAt "Last login timestamp"
        date createdAt "Account creation"
        date updatedAt "Last update"
    }

    REFERRALS {
        ObjectId _id PK
        ObjectId referrerId FK "References USERS._id"
        ObjectId referredUserId FK "References USERS._id"
        enum status "PENDING|CONFIRMED|CANCELLED"
        number creditsEarned "Default 0, set to 2 when confirmed"
        date confirmedAt "When referral confirmed"
        date cancelledAt "When referral cancelled"
        date createdAt "Referral creation"
        date updatedAt "Last update"
    }

    PURCHASES {
        ObjectId _id PK
        ObjectId userId FK "References USERS._id"
        number amount "Purchase amount"
        string description "Purchase description"
        string productId "Optional product identifier"
        object metadata "Optional additional data"
        enum status "PENDING|COMPLETED|CANCELLED"
        date createdAt "Purchase creation"
        date updatedAt "Last update"
    }

    USERS ||--o{ REFERRALS : "referrer_id"
    USERS ||--o{ REFERRALS : "referred_user_id"
    USERS ||--o{ PURCHASES : "user_id"

    USERS {
        index email_idx "email (unique)"
        index referralCode_idx "referralCode (unique)"
        index referredBy_idx "referredBy"
        index createdAt_idx "createdAt (-1)"
    }

    REFERRALS {
        index compound_unique_idx "referrerId + referredUserId (unique)"
        index referrer_status_idx "referrerId + status"
        index referred_status_idx "referredUserId + status"
        index status_created_idx "status + createdAt (-1)"
    }

    PURCHASES {
        index user_status_idx "userId + status"
        index user_created_idx "userId + createdAt (-1)"
        index status_idx "status"
    }
```

---

## 🔄 Data Flow Diagrams

### 💫 Credit Earning Data Flow

```mermaid
flowchart TD
    START([User Makes First Purchase]) --> VALIDATE{Validate Purchase Data}
    VALIDATE -->|Invalid| ERROR1[Return Validation Error]
    VALIDATE -->|Valid| CREATE[Create Purchase Record]

    CREATE --> CHECK{Is First Purchase?}
    CHECK -->|No| RETURN1[Return Purchase Success]
    CHECK -->|Yes| FIND[Find PENDING Referral]

    FIND --> EXISTS{Referral Exists?}
    EXISTS -->|No| RETURN1
    EXISTS -->|Yes| ATOMIC[Atomic Referral Conversion]

    ATOMIC --> UPDATE1[Update Referral Status to CONFIRMED]
    UPDATE1 --> UPDATE2[Set creditsEarned = 2]
    UPDATE2 --> PARALLEL{Parallel Credit Updates}

    PARALLEL --> CREDIT1[Award 2 Credits to Referrer]
    PARALLEL --> CREDIT2[Award 2 Credits to Referred User]

    CREDIT1 --> LOG[Log Success]
    CREDIT2 --> LOG
    LOG --> RETURN2[Return Purchase + Reward Info]

    ERROR1 --> END([End])
    RETURN1 --> END
    RETURN2 --> END

    style START fill:#e8f5e8
    style ATOMIC fill:#fff3e0
    style PARALLEL fill:#f3e5f5
    style END fill:#ffebee
```

### 🔒 Authentication Data Flow

```mermaid
flowchart TD
    LOGIN([User Login Request]) --> VALIDATE{Validate Credentials}
    VALIDATE -->|Invalid Format| ERROR1[Return Validation Error]
    VALIDATE -->|Valid Format| FIND[Find User by Email]

    FIND --> EXISTS{User Exists?}
    EXISTS -->|No| ERROR2[Return Invalid Credentials]
    EXISTS -->|Yes| COMPARE[Compare Password Hash]

    COMPARE --> MATCH{Password Matches?}
    MATCH -->|No| ERROR2
    MATCH -->|Yes| ACTIVE{User Active?}

    ACTIVE -->|No| ERROR3[Return Account Disabled]
    ACTIVE -->|Yes| GENERATE[Generate JWT Token]

    GENERATE --> REFRESH[Generate Refresh Token]
    REFRESH --> UPDATE[Update Last Login]
    UPDATE --> RETURN[Return User + Tokens]

    ERROR1 --> END([End])
    ERROR2 --> END
    ERROR3 --> END
    RETURN --> END

    style LOGIN fill:#e8f5e8
    style GENERATE fill:#e1f5fe
    style END fill:#ffebee
```

### 📊 Dashboard Data Aggregation Flow

```mermaid
flowchart TD
    REQUEST([Dashboard Request]) --> AUTH{User Authenticated?}
    AUTH -->|No| ERROR1[Return 401 Unauthorized]
    AUTH -->|Yes| PARALLEL{Parallel Data Queries}

    PARALLEL --> QUERY1[Get User Data]
    PARALLEL --> QUERY2[Get Referral Stats]
    PARALLEL --> QUERY3[Get Purchase History]
    PARALLEL --> QUERY4[Get Credit History]

    QUERY1 --> AGGREGATE[Aggregate Dashboard Data]
    QUERY2 --> AGGREGATE
    QUERY3 --> AGGREGATE
    QUERY4 --> AGGREGATE

    AGGREGATE --> CALCULATE[Calculate Metrics]
    CALCULATE --> FORMAT[Format Response]
    FORMAT --> RETURN[Return Dashboard Data]

    ERROR1 --> END([End])
    RETURN --> END

    style REQUEST fill:#e8f5e8
    style PARALLEL fill:#f3e5f5
    style CALCULATE fill:#fff3e0
    style END fill:#ffebee
```

---

## 🛡️ Security & Validation Architecture

### 🔐 Multi-Layer Security Model

```mermaid
graph TB
    subgraph "🌐 Request Layer"
        CORS[CORS Middleware]
        RATE[Rate Limiting]
        HELMET[Security Headers]
    end

    subgraph "🔍 Validation Layer"
        ZOD[Zod Schema Validation]
        CUSTOM[Custom Business Validation]
        SANITIZE[Input Sanitization]
    end

    subgraph "🛡️ Authentication Layer"
        JWT[JWT Token Verification]
        BLACKLIST[Token Blacklisting]
        REFRESH[Refresh Token Logic]
    end

    subgraph "🔒 Authorization Layer"
        RBAC[Role-Based Access Control]
        RESOURCE[Resource Ownership Check]
        PERMISSION[Permission Validation]
    end

    subgraph "🗄️ Data Layer"
        ENCRYPT[Password Encryption]
        HASH[Bcrypt Hashing]
        INDEX[Unique Constraints]
    end

    CORS --> ZOD
    RATE --> CUSTOM
    HELMET --> SANITIZE

    ZOD --> JWT
    CUSTOM --> BLACKLIST
    SANITIZE --> REFRESH

    JWT --> RBAC
    BLACKLIST --> RESOURCE
    REFRESH --> PERMISSION

    RBAC --> ENCRYPT
    RESOURCE --> HASH
    PERMISSION --> INDEX

    style CORS fill:#e3f2fd
    style ZOD fill:#f3e5f5
    style JWT fill:#fff3e0
    style RBAC fill:#e8f5e8
    style ENCRYPT fill:#ffebee
```

---

## 📋 System Interaction Summary

### 🎯 Key Integration Points

```mermaid
mindmap
  root((Referral & Credit System))
    Authentication
      JWT Tokens
      Password Hashing
      Session Management
      User Validation
    Referral Management
      Code Generation
      Relationship Tracking
      Status Management
      Reward Processing
    Purchase System
      Transaction Recording
      First Purchase Detection
      Reward Triggering
      Purchase History
    Dashboard Analytics
      Statistics Aggregation
      Data Visualization
      Performance Metrics
      User Insights
    Data Integrity
      Atomic Operations
      Race Condition Prevention
      Duplicate Detection
      Consistency Checks
    Security Layers
      Input Validation
      Authentication
      Authorization
      Data Protection
```

---

## 📈 Performance & Scalability Considerations

### ⚡ Database Query Optimization

```mermaid
graph LR
    subgraph "Query Patterns"
        Q1[User Login by Email]
        Q2[Referral Stats Aggregation]
        Q3[First Purchase Detection]
        Q4[Dashboard Data Loading]
    end

    subgraph "Index Strategy"
        I1[email (unique)]
        I2[referralCode (unique)]
        I3[referrerId + status (compound)]
        I4[userId + status (compound)]
    end

    subgraph "Performance Benefits"
        P1[O(1) User Lookup]
        P2[Fast Referral Validation]
        P3[Efficient Stats Queries]
        P4[Quick Purchase Checks]
    end

    Q1 --> I1 --> P1
    Q2 --> I3 --> P3
    Q3 --> I4 --> P4
    Q4 --> I2 --> P2

    style Q1 fill:#e3f2fd
    style I1 fill:#f3e5f5
    style P1 fill:#e8f5e8
```

This comprehensive UML documentation provides visual representations of:

- ✅ **System Architecture** with Clean Architecture layers
- ✅ **Domain Models** with entity relationships
- ✅ **Business Process Flows** with sequence diagrams
- ✅ **Component Dependencies** and interactions
- ✅ **Database Schema** with ERD
- ✅ **Data Flow Diagrams** for key processes
- ✅ **Security Architecture** with multi-layer protection
- ✅ **Performance Considerations** and optimization strategies

All diagrams use **Mermaid syntax** and can be rendered in GitHub, GitLab, or any Mermaid-compatible viewer! 🚀
