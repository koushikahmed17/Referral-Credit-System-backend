import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Referral & Credit System API",
    version: "1.0.0",
    description:
      "A comprehensive referral and credit system backend API built with Node.js, Express, TypeScript, and MongoDB.",
    contact: {
      name: "API Support",
      email: "support@referral-system.com",
    },
    license: {
      name: "ISC",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://api.referral-system.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token obtained from login endpoint",
      },
    },
    schemas: {
      // User Schemas
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Unique user identifier",
            example: "507f1f77bcf86cd799439011",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "user@example.com",
          },
          firstName: {
            type: "string",
            description: "User first name",
            example: "John",
          },
          lastName: {
            type: "string",
            description: "User last name",
            example: "Doe",
          },
          referralCode: {
            type: "string",
            description: "Unique referral code for this user",
            example: "JOHN123",
          },
          referredBy: {
            type: "string",
            description: "Referral code used during registration",
            example: "LINA123",
            nullable: true,
          },
          credits: {
            type: "number",
            description: "Current credit balance",
            example: 10,
            default: 0,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "User creation timestamp",
            example: "2024-01-15T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "User last update timestamp",
            example: "2024-01-15T10:30:00.000Z",
          },
        },
        required: [
          "_id",
          "email",
          "firstName",
          "lastName",
          "referralCode",
          "credits",
        ],
      },

      // Auth Schemas
      RegisterRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "user@example.com",
          },
          password: {
            type: "string",
            minLength: 6,
            description: "User password (minimum 6 characters)",
            example: "password123",
          },
          firstName: {
            type: "string",
            description: "User first name",
            example: "John",
          },
          lastName: {
            type: "string",
            description: "User last name",
            example: "Doe",
          },
          referralCode: {
            type: "string",
            description: "Optional referral code to apply during registration",
            example: "LINA123",
            nullable: true,
          },
        },
        required: ["email", "password", "firstName", "lastName"],
      },

      LoginRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "user@example.com",
          },
          password: {
            type: "string",
            description: "User password",
            example: "password123",
          },
        },
        required: ["email", "password"],
      },

      AuthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Request success status",
            example: true,
          },
          message: {
            type: "string",
            description: "Response message",
            example: "User registered successfully",
          },
          data: {
            type: "object",
            properties: {
              user: {
                $ref: "#/components/schemas/User",
              },
              token: {
                type: "string",
                description: "JWT access token",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
              refreshToken: {
                type: "string",
                description: "JWT refresh token",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
        required: ["success", "message", "data"],
      },

      // Referral Schemas
      Referral: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Unique referral identifier",
            example: "507f1f77bcf86cd799439011",
          },
          referrerId: {
            type: "string",
            description: "ID of the user who made the referral",
            example: "507f1f77bcf86cd799439012",
          },
          referredUserId: {
            type: "string",
            description: "ID of the user who was referred",
            example: "507f1f77bcf86cd799439013",
          },
          status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "CANCELLED"],
            description: "Referral status",
            example: "PENDING",
          },
          creditsEarned: {
            type: "number",
            description: "Credits earned from this referral",
            example: 2,
            default: 0,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Referral creation timestamp",
            example: "2024-01-15T10:30:00.000Z",
          },
          confirmedAt: {
            type: "string",
            format: "date-time",
            description: "Referral confirmation timestamp",
            example: "2024-01-15T11:30:00.000Z",
            nullable: true,
          },
        },
        required: [
          "_id",
          "referrerId",
          "referredUserId",
          "status",
          "creditsEarned",
        ],
      },

      ReferralStats: {
        type: "object",
        properties: {
          totalReferrals: {
            type: "number",
            description: "Total number of referrals made",
            example: 5,
          },
          confirmedReferrals: {
            type: "number",
            description: "Number of confirmed referrals",
            example: 3,
          },
          pendingReferrals: {
            type: "number",
            description: "Number of pending referrals",
            example: 2,
          },
          totalCreditsEarned: {
            type: "number",
            description: "Total credits earned from referrals",
            example: 6,
          },
          conversionRate: {
            type: "number",
            description: "Referral conversion rate (0-1)",
            example: 0.6,
          },
        },
        required: [
          "totalReferrals",
          "confirmedReferrals",
          "pendingReferrals",
          "totalCreditsEarned",
          "conversionRate",
        ],
      },

      // Purchase Schemas
      Purchase: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Unique purchase identifier",
            example: "507f1f77bcf86cd799439011",
          },
          userId: {
            type: "string",
            description: "ID of the user who made the purchase",
            example: "507f1f77bcf86cd799439012",
          },
          amount: {
            type: "number",
            description: "Purchase amount",
            example: 99.99,
          },
          description: {
            type: "string",
            description: "Purchase description",
            example: "Premium Subscription",
          },
          status: {
            type: "string",
            enum: ["PENDING", "COMPLETED", "CANCELLED", "REFUNDED"],
            description: "Purchase status",
            example: "COMPLETED",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Purchase creation timestamp",
            example: "2024-01-15T10:30:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Purchase last update timestamp",
            example: "2024-01-15T10:30:00.000Z",
          },
        },
        required: ["_id", "userId", "amount", "description", "status"],
      },

      CreatePurchaseRequest: {
        type: "object",
        properties: {
          amount: {
            type: "number",
            minimum: 0.01,
            description: "Purchase amount (must be greater than 0)",
            example: 99.99,
          },
          description: {
            type: "string",
            minLength: 1,
            maxLength: 500,
            description: "Purchase description",
            example: "Premium Subscription",
          },
        },
        required: ["amount", "description"],
      },

      PurchaseResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Request success status",
            example: true,
          },
          message: {
            type: "string",
            description: "Response message",
            example: "Purchase created successfully",
          },
          data: {
            type: "object",
            properties: {
              purchase: {
                $ref: "#/components/schemas/Purchase",
              },
              referralReward: {
                type: "object",
                properties: {
                  awarded: {
                    type: "boolean",
                    description: "Whether referral reward was awarded",
                    example: true,
                  },
                  creditsEarned: {
                    type: "number",
                    description: "Credits earned from referral",
                    example: 2,
                  },
                  message: {
                    type: "string",
                    description: "Reward message",
                    example:
                      "Congratulations! You and your referrer each earned 2 credits!",
                  },
                },
                nullable: true,
              },
            },
          },
        },
        required: ["success", "message", "data"],
      },

      // Dashboard Schemas
      DashboardStats: {
        type: "object",
        properties: {
          totalReferrals: {
            type: "number",
            description: "Total referrals made by user",
            example: 10,
          },
          confirmedReferrals: {
            type: "number",
            description: "Confirmed referrals",
            example: 7,
          },
          totalCredits: {
            type: "number",
            description: "Current credit balance",
            example: 25,
          },
          creditsEarned: {
            type: "number",
            description: "Total credits earned from referrals",
            example: 14,
          },
          totalPurchases: {
            type: "number",
            description: "Total purchases made",
            example: 5,
          },
          totalSpent: {
            type: "number",
            description: "Total amount spent",
            example: 499.95,
          },
        },
        required: [
          "totalReferrals",
          "confirmedReferrals",
          "totalCredits",
          "creditsEarned",
          "totalPurchases",
          "totalSpent",
        ],
      },

      // Error Schemas
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Request success status",
            example: false,
          },
          message: {
            type: "string",
            description: "Error message",
            example: "Invalid credentials",
          },
          error: {
            type: "string",
            description: "Error type or code",
            example: "VALIDATION_ERROR",
            nullable: true,
          },
          details: {
            type: "object",
            description: "Additional error details",
            nullable: true,
          },
        },
        required: ["success", "message"],
      },

      ValidationError: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Request success status",
            example: false,
          },
          message: {
            type: "string",
            description: "Validation error message",
            example: "Validation failed",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  description: "Field that failed validation",
                  example: "email",
                },
                message: {
                  type: "string",
                  description: "Validation error message",
                  example: "Email is required",
                },
              },
            },
          },
        },
        required: ["success", "message", "errors"],
      },

      // Pagination Schemas
      PaginationQuery: {
        type: "object",
        properties: {
          page: {
            type: "integer",
            minimum: 1,
            description: "Page number (starts from 1)",
            example: 1,
            default: 1,
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            description: "Number of items per page",
            example: 10,
            default: 10,
          },
        },
      },

      PaginatedResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Request success status",
            example: true,
          },
          message: {
            type: "string",
            description: "Response message",
            example: "Data retrieved successfully",
          },
          data: {
            type: "array",
            items: {},
            description: "Array of data items",
          },
          pagination: {
            type: "object",
            properties: {
              page: {
                type: "integer",
                description: "Current page number",
                example: 1,
              },
              limit: {
                type: "integer",
                description: "Items per page",
                example: 10,
              },
              total: {
                type: "integer",
                description: "Total number of items",
                example: 25,
              },
              pages: {
                type: "integer",
                description: "Total number of pages",
                example: 3,
              },
              hasNext: {
                type: "boolean",
                description: "Whether there is a next page",
                example: true,
              },
              hasPrev: {
                type: "boolean",
                description: "Whether there is a previous page",
                example: false,
              },
            },
            required: ["page", "limit", "total", "pages", "hasNext", "hasPrev"],
          },
        },
        required: ["success", "message", "data", "pagination"],
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints",
    },
    {
      name: "Referrals",
      description: "Referral management and tracking endpoints",
    },
    {
      name: "Purchases",
      description: "Purchase simulation and management endpoints",
    },
    {
      name: "Dashboard",
      description: "User dashboard and statistics endpoints",
    },
    {
      name: "Health",
      description: "System health and status endpoints",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/presentation/routes/*.ts"], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
