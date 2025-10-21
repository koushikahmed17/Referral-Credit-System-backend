import mongoose, { Schema, Document } from "mongoose";
import { PurchaseStatus } from "../../app/interfaces/purchase.interface";

export interface IPurchase extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  productId?: string;
  metadata?: Record<string, any>;
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseSchema = new Schema<IPurchase>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    productId: {
      type: String,
      trim: true,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: Object.values(PurchaseStatus),
      default: PurchaseStatus.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
purchaseSchema.index({ userId: 1, createdAt: -1 });
purchaseSchema.index({ status: 1, createdAt: -1 });
purchaseSchema.index({ userId: 1, status: 1 });

// Static method to check if user has any completed purchases
purchaseSchema.statics.hasCompletedPurchases = async function (
  userId: string
): Promise<boolean> {
  const count = await this.countDocuments({
    userId,
    status: PurchaseStatus.COMPLETED,
  });
  return count > 0;
};

export const PurchaseModel = mongoose.model<IPurchase>(
  "Purchase",
  purchaseSchema
);
